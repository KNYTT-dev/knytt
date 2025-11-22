"use client";

import { MasonryGrid } from "@/components/home";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { SignupCTA } from "@/components/home/SignupCTA";
import { FeaturesZigZag } from "@/components/home/FeaturesZigZag";
import { RecommendationCarousel } from "@/components/recommendations/RecommendationCarousel";
import { useDiscover } from "@/lib/queries/discover";
import { useFeed } from "@/lib/queries/recommendations";
import { useAuth } from "@/lib/queries/auth";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  // Fetch personalized recommendations for authenticated users
  const { data: recommendedData, isLoading: recommendationsLoading, error: recommendationsError } = useFeed(userId);

  // Fetch featured products using discover endpoint - available to everyone
  const { data, isLoading } = useDiscover(
    {
      sort_by: "popular",
      limit: 40,
    },
    {
      enabled: true,
    }
  );

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Animated Background */}
      <EnhancedHeroSection />

      {/* Personalized Recommendations (Authenticated Users Only) */}
      {isAuthenticated && !recommendationsError && (
        <section className="py-8 bg-gradient-to-b from-white to-ivory">
          <div className="container mx-auto px-4">
            {recommendationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-pinterest-red animate-spin" />
              </div>
            ) : (
              recommendedData &&
              recommendedData.results.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-pinterest-red" />
                      <h2 className="text-2xl font-bold text-charcoal">
                        Recommended For You
                      </h2>
                    </div>
                    <Link
                      href="/feed"
                      className="text-pinterest-red hover:text-dark-red transition-colors font-medium"
                    >
                      See All →
                    </Link>
                  </div>
                  <RecommendationCarousel
                    title=""
                    products={recommendedData.results}
                    userId={userId}
                    context="homepage_recommendations"
                  />
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="products-section" className="py-12 bg-ivory">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-pinterest-red animate-spin mx-auto mb-4" />
                <p className="text-gray">Loading products...</p>
              </div>
            </div>
          )}

          {/* Products Masonry Grid */}
          {data && data.results.length > 0 && (
            <MasonryGrid products={data.results} userId={userId} />
          )}

          {/* Empty State */}
          {data && data.results.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray text-lg">
                No products available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <FeaturesZigZag />

      {/* Signup CTA (Non-Authenticated Users Only) */}
      {!isAuthenticated && <SignupCTA />}
    </div>
  );
}
