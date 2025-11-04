"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search";
import { ProductGrid } from "@/components/products";
import { useSearch } from "@/lib/queries/search";
import { useAuth } from "@/lib/queries/auth";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { user } = useAuth();

  // Use the search hook - it will only run when searchQuery is not empty
  const { data, isLoading, error } = useSearch(
    {
      query: searchQuery,
      limit: 20,
    },
    {
      enabled: hasSearched && searchQuery.length > 0,
    }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-white via-light-gray to-pinterest-red/5 border-b border-light-gray">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-charcoal mb-6">
            Search Products
          </h1>
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pinterest-red border-r-transparent"></div>
            <p className="mt-4 text-gray">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">
              Error: {error.message}
            </p>
          </div>
        )}

        {/* Empty State - Before Search */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray text-lg">
              Enter a search query to find products
            </p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !isLoading && !error && data?.results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray text-lg">
              No products found for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-gray">
                Found {data.total} results in {data.search_time_ms.toFixed(0)}ms
                {data.personalized && " (personalized)"}
              </p>
            </div>

            <ProductGrid
              products={data.results}
              userId={user?.id}
              columns={4}
              onProductClick={(productId) => {
                console.log("Product clicked:", productId);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
