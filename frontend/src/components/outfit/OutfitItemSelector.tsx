"use client";

import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OutfitSlotType, OUTFIT_SLOT_CONFIG } from "@/types/outfit";
import { ProductResult } from "@/types/product";
import { useAuth } from "@/lib/queries/auth";
import { useDiscover } from "@/lib/queries/discover";
import { ProductCard } from "@/components/products/ProductCard";
import { useOutfitStore } from "@/lib/stores/outfitStore";
import { useToast } from "@/components/ui/Toast";

interface OutfitItemSelectorProps {
  isOpen: boolean;
  slotType: OutfitSlotType | null;
  onClose: () => void;
}

export function OutfitItemSelector({
  isOpen,
  slotType,
  onClose,
}: OutfitItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const toast = useToast();
  const addItemToSlot = useOutfitStore((state) => state.addItemToSlot);

  // Fetch products (using discover endpoint)
  const { data: productsData, isLoading } = useDiscover({ limit: 100 });
  const products = productsData?.results || [];

  // Filter products by slot's category and search query
  const filteredProducts = slotType
    ? products.filter((product) => {
        // Search filter - search against title, brand, and description
        const matchesSearch = searchQuery
          ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        // If user is searching, show all matching products regardless of category
        if (searchQuery && matchesSearch) {
          return true;
        }

        // If no search, apply category filter
        const categoryFilter = OUTFIT_SLOT_CONFIG[slotType].category_filter;
        const matchesCategory = categoryFilter.some(
          (cat) =>
            product.category_name?.toLowerCase().includes(cat.toLowerCase()) ||
            product.fashion_category?.toLowerCase().includes(cat.toLowerCase())
        );

        return matchesCategory && matchesSearch;
      })
    : [];

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleProductClick = (product: ProductResult) => {
    if (slotType) {
      addItemToSlot(slotType, product);
      toast.success(
        "Item added",
        `${product.title} added to ${OUTFIT_SLOT_CONFIG[slotType].label}`
      );
      onClose();
    }
  };

  if (!slotType) return null;

  const slotConfig = OUTFIT_SLOT_CONFIG[slotType];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[var(--z-modal)]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-[calc(var(--z-modal)+1)] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">
                    Add {slotConfig.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select an item for your outfit
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${slotConfig.label.toLowerCase()}...`}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full border-none placeholder:text-gray-400 text-charcoal focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a94ff]/30 transition-all"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-4 md:p-6">
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-xl animate-shimmer"
                    />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">
                    No items found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    {searchQuery
                      ? `No ${slotConfig.label.toLowerCase()} matching "${searchQuery}"`
                      : `No ${slotConfig.label.toLowerCase()} available right now. Try browsing other categories.`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      {filteredProducts.length} item
                      {filteredProducts.length !== 1 ? "s" : ""} available
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.product_id}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer"
                      >
                        <ProductCard
                          product={product}
                          userId={user?.id}
                          onProductClick={() => handleProductClick(product)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
