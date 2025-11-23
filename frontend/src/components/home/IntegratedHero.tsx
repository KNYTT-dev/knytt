'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HERO_MESSAGES = [
  {
    line1: "Find your next",
    line2: "favorite outfit",
  },
  {
    line1: "Discover home decor",
    line2: "you'll love",
  },
  {
    line1: "Get",
    line2: "style inspiration",
  },
  {
    line1: "One feed. Every brand.",
    line2: "Your vibe.",
  },
];

const ROTATION_INTERVAL = 6000; // 6 seconds per message

interface IntegratedHeroProps {
  onScrollToProducts?: () => void;
}

export function IntegratedHero({ onScrollToProducts }: IntegratedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate messages
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_MESSAGES.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentMessage = HERO_MESSAGES[currentIndex];

  const scrollToProducts = () => {
    if (onScrollToProducts) {
      onScrollToProducts();
    } else {
      const productsSection = document.querySelector('#products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-8 md:p-12 lg:p-16 min-h-[400px] flex flex-col items-center justify-center text-center overflow-hidden border border-light-gray shadow-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238a94ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 bg-[#8a94ff]/10 rounded-full border border-[#8a94ff]/20 mb-6">
        <Sparkles className="w-4 h-4 text-[#8a94ff]" />
        <span className="text-sm text-charcoal font-medium">
          AI-Powered Product Discovery
        </span>
      </div>

      {/* Rotating Hero Text */}
      <div className="relative z-10 mb-6 min-h-[100px] md:min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-charcoal">
              {currentMessage.line1}
              <br />
              <span className="text-[#8a94ff]">{currentMessage.line2}</span>
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subheading */}
      <p className="relative z-10 text-sm md:text-base text-gray max-w-xl mx-auto mb-6">
        Discover products you'll love from thousands of brands, all in one place.
      </p>

      {/* Browse Button */}
      <button
        onClick={scrollToProducts}
        className="relative z-10 px-6 py-3 md:px-8 md:py-4 bg-[#8a94ff] text-white rounded-full font-semibold text-base md:text-lg hover:bg-[#6a7ae0] transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Start Browsing
      </button>

      {/* Carousel Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-6">
        {HERO_MESSAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), ROTATION_INTERVAL * 2);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#8a94ff]'
                : 'w-2 h-2 bg-light-gray hover:bg-gray-300'
            }`}
            aria-label={`Go to message ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

