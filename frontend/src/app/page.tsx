"use client";

import { HeroSection, CategoryPills, MasonryGrid } from "@/components/home";
import { RecommendationCarousel } from "@/components/recommendations/RecommendationCarousel";
import { useSearch } from "@/lib/queries/search";
import { useFeed } from "@/lib/queries/recommendations";
import { useAuth } from "@/lib/queries/auth";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  // Fetch personalized recommendations for authenticated users
  const { data: recommendedData, isLoading: recommendationsLoading } = useFeed(
    user?.id ? parseInt(user.id.toString()) : undefined,
    {
      limit: 12,
      use_session_context: true,
      enable_diversity: true,
      enabled: isAuthenticated && !!user?.id,
    }
  );

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

      {/* Personalized Recommendations (Authenticated Users Only) */}
      {isAuthenticated && (
        <section className="py-8 bg-gradient-to-b from-white to-ivory">
          <div className="container mx-auto px-4">
            {recommendationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-sage animate-spin" />
              </div>
            ) : (
              recommendedData &&
              recommendedData.results.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-sage" />
                      <h2 className="text-2xl font-bold text-evergreen">
                        Recommended For You
                      </h2>
                    </div>
                    <Link
                      href="/feed"
                      className="text-sage hover:text-evergreen transition-colors font-medium"
                    >
                      See All →
                    </Link>
                  </div>
                  <RecommendationCarousel
                    title=""
                    products={recommendedData.results}
                    userId={user?.id.toString()}
                    context="homepage_recommendations"
                  />
                </div>
              )
            )}
          </div>
        </section>
      )}

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
            <MasonryGrid products={data.results} userId={user?.id} />
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
