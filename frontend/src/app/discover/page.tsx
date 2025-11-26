"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/lib/queries/auth";
import { useInfiniteDiscover } from "@/lib/queries/discover";
import { ProductGrid } from "@/components/products";
import { Loader2, Compass, SlidersHorizontal, X } from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;

  // Filter state
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "price_low" | "price_high">("popular");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  // Infinite scroll
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  // Fetch products with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDiscover({
    limit: 20,
    sort_by: sortBy,
    min_price: minPrice,
    max_price: maxPrice,
  });

  // Auto-fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into single array
  const allProducts = data?.pages?.flatMap((page: any) => page.results) ?? [];
  const totalResults = data?.pages?.[0]?.total ?? 0;

  // Price filter handlers
  const handleMinPriceChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setMinPrice(num);
    } else if (value === '') {
      setMinPrice(undefined);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setMaxPrice(num);
    } else if (value === '') {
      setMaxPrice(undefined);
    }
  };

  const clearPriceFilter = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const clearAllFilters = () => {
    setSortBy("popular");
    clearPriceFilter();
  };

  // Check if any filters are active
  const hasActiveFilters = sortBy !== "popular" || minPrice !== undefined || maxPrice !== undefined;
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-sage animate-spin mb-4" />
            <p className="text-sage">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-red-600 font-medium">Error: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-sage/20 to-terracotta/20 rounded-full">
            <Compass className="w-5 h-5 text-evergreen" />
            <span className="text-sm font-medium text-evergreen">
              Browse All Products
            </span>
          </div>
          <h1 className="text-5xl font-bold text-evergreen mb-4">
            Discover
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto">
            Explore our entire collection of {totalResults.toLocaleString()} products
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Sort Controls */}
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-5 h-5 text-sage" />
                <span className="text-sm font-medium text-evergreen">Sort by:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "popular", label: "Most Popular" },
                  { value: "recent", label: "Recently Added" },
                  { value: "price_low", label: "Price: Low to High" },
                  { value: "price_high", label: "Price: High to Low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? "bg-evergreen text-white"
                        : "bg-white border-2 border-light-gray text-evergreen hover:bg-blush"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-evergreen">Price Range:</span>
                {hasPriceFilter && (
                  <button
                    onClick={clearPriceFilter}
                    className="text-xs text-terracotta hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-sage mb-1">Min Price</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="$0"
                    value={minPrice ?? ''}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-evergreen/20 focus:border-evergreen"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sage mb-1">Max Price</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="No limit"
                    value={maxPrice ?? ''}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-evergreen/20 focus:border-evergreen"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-sage">Active filters:</span>

            {sortBy !== "popular" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-evergreen/10 text-evergreen rounded-full text-sm font-medium">
                Sort: {sortBy === "recent" ? "Recently Added" : sortBy === "price_low" ? "Price: Low to High" : "Price: High to Low"}
                <button
                  onClick={() => setSortBy("popular")}
                  className="hover:bg-evergreen/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasPriceFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm font-medium">
                ${minPrice ?? 0} - ${maxPrice ?? '∞'}
                <button
                  onClick={clearPriceFilter}
                  className="hover:bg-terracotta/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-sm text-sage hover:text-evergreen hover:underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Stats Banner */}
        <div className="mb-8 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-sage">
            Showing {allProducts.length.toLocaleString()} of {totalResults.toLocaleString()} products
          </p>
        </div>

        {/* Products Grid */}
        {allProducts.length > 0 ? (
          <div>
            <ProductGrid
              products={allProducts}
              userId={userId}
              columns={4}
              onProductClick={(productId) => {
                router.push(`/products/${productId}`);
              }}
            />

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="py-8 text-center">
                {isFetchingNextPage ? (
                  <div className="inline-block">
                    <Loader2 className="w-8 h-8 text-sage animate-spin" />
                    <p className="mt-2 text-sage text-sm">Loading more...</p>
                  </div>
                ) : (
                  <button
                    onClick={() => fetchNextPage()}
                    className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && allProducts.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sage text-sm">
                  You've reached the end of the results
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <Compass className="w-16 h-16 text-sage/30 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-evergreen mb-2">
              No products found
            </h2>
            <p className="text-sage mb-6">
              Try adjusting your filters to see more products
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
