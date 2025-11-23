"use client";

import { MasonryGrid, HowItWorks } from "@/components/home";
import { SignupCTA } from "@/components/home/SignupCTA";
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

  const scrollToProducts = () => {
    // Since hero is now in the grid, just scroll to a bit below the hero
    window.scrollTo({ behavior: 'smooth', top: window.innerHeight * 0.6 });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Main Content with Integrated Hero */}
      <section id="products-section" className="pt-6 pb-12">
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

          {/* Products Masonry Grid with Integrated Hero */}
          {data && data.results.length > 0 && (
            <MasonryGrid
              products={data.results}
              userId={userId}
              showHero={true}
              onScrollToProducts={scrollToProducts}
            />
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

      {/* Personalized Recommendations (Authenticated Users Only) */}
      {isAuthenticated && !recommendationsError && (
        <section className="py-12 bg-white border-t border-light-gray">
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

      {/* Signup CTA (Non-Authenticated Users Only) */}
      {!isAuthenticated && <SignupCTA />}

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
}
