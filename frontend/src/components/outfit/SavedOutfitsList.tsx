"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Eye, Heart } from "lucide-react";
import { useOutfitStore } from "@/lib/stores/outfitStore";
import { useToast } from "@/components/ui/Toast";
import { SavedOutfit, OUTFIT_SLOT_CONFIG } from "@/types/outfit";
import { motion } from "framer-motion";

export function SavedOutfitsList() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const savedOutfits = useOutfitStore((state) => state.savedOutfits);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const deleteOutfit = useOutfitStore((state) => state.deleteOutfit);
  const toast = useToast();

  const handleLoad = (outfit: SavedOutfit) => {
    loadOutfit(outfit.outfit_id);
    toast.success("Outfit loaded", `"${outfit.name}" is now in your builder`);

    // Scroll to top to show builder
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (outfit: SavedOutfit) => {
    if (deletingId !== outfit.outfit_id) {
      setDeletingId(outfit.outfit_id);
      return;
    }

    deleteOutfit(outfit.outfit_id);
    setDeletingId(null);
    toast.info("Outfit deleted", `"${outfit.name}" has been removed`);
  };

  if (savedOutfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-charcoal mb-2">
          No saved outfits yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Create an outfit in the builder above and save it to your collection.
          You can load and edit saved outfits anytime!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          Saved Outfits
        </h2>
        <p className="text-sm text-gray-600">
          {savedOutfits.length} outfit{savedOutfits.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedOutfits.map((outfit) => (
          <OutfitCard
            key={outfit.outfit_id}
            outfit={outfit}
            onLoad={() => handleLoad(outfit)}
            onDelete={() => handleDelete(outfit)}
            isDeleting={deletingId === outfit.outfit_id}
          />
        ))}
      </div>
    </div>
  );
}

interface OutfitCardProps {
  outfit: SavedOutfit;
  onLoad: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function OutfitCard({ outfit, onLoad, onDelete, isDeleting }: OutfitCardProps) {
  const [showActions, setShowActions] = useState(false);

  // Get filled slots
  const filledSlots = Object.values(outfit.slots)
    .filter((slot) => slot.item !== null)
    .sort(
      (a, b) =>
        OUTFIT_SLOT_CONFIG[a.type].order - OUTFIT_SLOT_CONFIG[b.type].order
    );

  const totalPrice = filledSlots.reduce(
    (sum, slot) => sum + (slot.item?.price || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#8a94ff] hover:shadow-lg transition-all duration-300"
    >
      {/* Outfit Preview - Thumbnail Grid */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {filledSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 p-1 h-full">
            {filledSlots.slice(0, 4).map((slot, index) => (
              <div
                key={slot.type}
                className="relative bg-white rounded overflow-hidden"
              >
                <Image
                  src={slot.item!.image_url}
                  alt={slot.item!.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
            {/* If only 3 items, add placeholder */}
            {filledSlots.length === 3 && (
              <div className="bg-gray-200 rounded flex items-center justify-center">
                <span className="text-2xl text-gray-400">+</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl text-gray-300">?</span>
          </div>
        )}

        {/* Item Count Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
          <span className="text-xs font-semibold text-white">
            {filledSlots.length} item{filledSlots.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Action Buttons Overlay */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-3"
          >
            <button
              onClick={onLoad}
              className="p-3 bg-[#8a94ff] text-white rounded-full shadow-lg hover:bg-[#6a7ae0] hover:scale-110 transition-all active:scale-95"
              aria-label="Load outfit"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className={`p-3 rounded-full shadow-lg hover:scale-110 transition-all active:scale-95 ${
                isDeleting
                  ? "bg-red-600 text-white"
                  : "bg-white text-red-600 hover:bg-red-50"
              }`}
              aria-label={isDeleting ? "Click again to confirm" : "Delete outfit"}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Outfit Info */}
      <div className="p-4">
        <h3 className="text-base font-bold text-charcoal mb-2 line-clamp-1">
          {outfit.name}
        </h3>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {new Date(outfit.created_at).toLocaleDateString()}
          </span>
          <span className="font-bold text-[#8a94ff]">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
