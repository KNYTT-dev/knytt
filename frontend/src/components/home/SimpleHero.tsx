'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function SimpleHero() {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Headline carousel data
  const headlines = [
    { line1: "Find your next", line2: "favorite outfit" },
    { line1: "Discover styles", line2: "you'll love" },
    { line1: "Get your next", line2: "wardrobe staple" },
    { line1: "One feed. Every brand.", line2: "Your vibe." }
  ];

  // Image arrays for masonry columns
  const leftImages = [
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400"
  ];

  const rightImages = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
  ];

  // Split images into 2 columns per side
  const leftColumn1 = leftImages.filter((_, i) => i % 2 === 0);
  const leftColumn2 = leftImages.filter((_, i) => i % 2 === 1);
  const rightColumn1 = rightImages.filter((_, i) => i % 2 === 0);
  const rightColumn2 = rightImages.filter((_, i) => i % 2 === 1);

  // Aspect ratios for masonry effect
  const aspectRatios = {
    col1: ["3/4", "4/5", "1/1"],
    col2: ["4/5", "3/4", "1/1"]
  };

  // Auto-rotation with hover pause
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, headlines.length]);

  // Floating animation variants with opacity pulse
  const floatingVariants = (index: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 0.8,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: "easeOut" as const
      }
    },
    float: {
      y: [0, -12, 0],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 6 + (index % 3) * 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: index * 0.5
      }
    }
  });

  // Masonry column component
  const MasonryColumn = ({ images, aspectRatios, startIndex = 0, offset = false }: {
    images: string[];
    aspectRatios: string[];
    startIndex?: number;
    offset?: boolean;
  }) => (
    <div className={`flex flex-col gap-4 ${offset ? 'mt-12' : ''}`}>
      {images.map((url, idx) => (
        <motion.div
          key={idx}
          variants={floatingVariants(startIndex + idx)}
          initial="initial"
          animate={["animate", "float"]}
          className="relative rounded-2xl overflow-hidden shadow-lg"
          style={{ aspectRatio: aspectRatios[idx] }}
        >
          <Image
            src={url}
            alt="Fashion product"
            fill
            className="object-cover brightness-95 saturate-90"
            unoptimized
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-ivory">
      {/* Left Masonry - Hidden on mobile */}
      <div className="hidden md:block absolute md:left-[-5%] lg:left-[-10%] top-0 bottom-0 md:w-[25%] lg:w-[30%]">
        <div className="grid grid-cols-2 gap-4 h-full px-2">
          <MasonryColumn
            images={leftColumn1}
            aspectRatios={aspectRatios.col1}
            startIndex={0}
          />
          <MasonryColumn
            images={leftColumn2}
            aspectRatios={aspectRatios.col2}
            startIndex={3}
            offset={true}
          />
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 z-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-[600px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8a94ff]/10 rounded-full border border-[#8a94ff]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#8a94ff]" />
            <span className="text-sm text-charcoal font-medium">
              AI-Powered Apparel Discovery
            </span>
          </div>

          {/* Rotating Headline with hover pause */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeadlineIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8"
              >
                <span className="block text-charcoal">
                  {headlines[currentHeadlineIndex].line1}
                </span>
                <span className="block text-[#8a94ff]">
                  {headlines[currentHeadlineIndex].line2}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {headlines.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentHeadlineIndex(index)}
                aria-label={`Show headline ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentHeadlineIndex
                    ? 'w-8 bg-[#8a94ff]'
                    : 'w-2 bg-gray/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-[#8a94ff] text-white rounded-full font-semibold text-lg hover:bg-[#6a7ae0] transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Get Started Free
          </Link>

          {/* Social Proof */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/32?img=${i + 10}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-gray">Join 50,000+ style seekers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Masonry - Hidden on mobile */}
      <div className="hidden md:block absolute md:right-[-5%] lg:right-[-10%] top-0 bottom-0 md:w-[25%] lg:w-[30%]">
        <div className="grid grid-cols-2 gap-4 h-full px-2">
          <MasonryColumn
            images={rightColumn1}
            aspectRatios={aspectRatios.col1}
            startIndex={6}
          />
          <MasonryColumn
            images={rightColumn2}
            aspectRatios={aspectRatios.col2}
            startIndex={9}
            offset={true}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 text-sm text-gray hover:text-charcoal transition-colors"
      >
        Here&apos;s how it works
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </section>
  );
}
