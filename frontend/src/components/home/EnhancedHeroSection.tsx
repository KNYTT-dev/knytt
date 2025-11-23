'use client';

import { Sparkles, ArrowDown } from 'lucide-react';
import AnimatedProductCardsBackground from './AnimatedProductCardsBackground';

export function EnhancedHeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[600px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Animated Product Cards Background */}
      <AnimatedProductCardsBackground />

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
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight text-white"
            style={{
              textShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            One feed. Every brand.
            <br />
            <span
              className="text-[#8a94ff]"
              style={{
                textShadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              Your vibe.
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto font-medium"
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
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
