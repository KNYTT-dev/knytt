'use client';

import AnimatedMasonryBackground from './AnimatedMasonryBackground';
import SignupModal from './SignupModal';
import FeatureShowcase from './FeatureShowcase';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full viewport with split design */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <AnimatedMasonryBackground />

        {/* Centered Signup Modal */}
        <div className="relative z-10 px-4 w-full flex justify-center" data-signup-modal>
          <SignupModal />
        </div>
      </section>

      {/* Feature Showcase - Below the fold */}
      <FeatureShowcase />
    </div>
  );
}
