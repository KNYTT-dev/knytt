"use client";

import { HeroSection, CategoryPills, MasonryGrid } from "@/components/home";
import { useSearch } from "@/lib/queries/search";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  // Fetch featured products using a general query
  // Note: Backend requires non-empty query, so we use a broad search term
  const { data, isLoading } = useSearch(
    {
      query: "fashion", // Broad query to get diverse results
      limit: 40,
    },
    {
      enabled: true, // Always fetch
    }
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Category Navigation */}
      <CategoryPills />

      {/* Main Content */}
      <section className="py-12 bg-ivory">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-evergreen mb-2">
              Discover Products
            </h2>
            <p className="text-evergreen/60">
              Explore curated collections powered by AI
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-sage animate-spin mx-auto mb-4" />
                <p className="text-evergreen/60">Loading products...</p>
              </div>
            </div>
          )}

          {/* Products Masonry Grid */}
          {data && data.results.length > 0 && (
            <MasonryGrid products={data.results} userId={1} />
          )}

          {/* Empty State */}
          {data && data.results.length === 0 && (
            <div className="text-center py-20">
              <p className="text-evergreen/60 text-lg">
                No products available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-sage to-evergreen">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-ivory mb-4">
            Ready to Find Your Style?
          </h2>
          <p className="text-ivory/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users discovering products they love with our
            AI-powered recommendations.
          </p>
          <button className="px-8 py-4 bg-white text-evergreen rounded-full font-semibold text-lg hover:bg-ivory transition-colors shadow-xl">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
