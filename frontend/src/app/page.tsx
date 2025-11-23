"use client";

import { HowItWorks, FeaturesZigZag } from "@/components/home";
import { SignupCTA } from "@/components/home/SignupCTA";
import { SimpleHero } from "@/components/home/SimpleHero";
import { useAuth } from "@/lib/queries/auth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section - What We Are */}
      <SimpleHero />

      {/* Features Section - Key Benefits */}
      <FeaturesZigZag />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Signup CTA (Non-Authenticated Users Only) */}
      {!isAuthenticated && <SignupCTA />}
    </div>
  );
}
