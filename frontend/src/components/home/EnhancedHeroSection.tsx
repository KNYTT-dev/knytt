'use client';

import { Sparkles, ArrowDown } from 'lucide-react';
import AnimatedMasonryBackground from '../landing/AnimatedMasonryBackground';

export function EnhancedHeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[600px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Animated Masonry Background */}
      <AnimatedMasonryBackground />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-[#8a94ff]" />
            <span className="text-sm text-charcoal font-medium">
              AI-Powered Product Discovery
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
            One feed. Every brand.
            <br />
            <span className="text-[#8a94ff] drop-shadow-2xl">Your vibe.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-lg">
            Discover products you'll love from thousands of brands, all in one place.
          </p>

          {/* Browse Button */}
          <button
            onClick={scrollToProducts}
            className="group px-8 py-4 bg-white/95 backdrop-blur-sm text-[#8a94ff] rounded-full font-semibold text-lg hover:bg-white transition-all shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            Start Browsing
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
