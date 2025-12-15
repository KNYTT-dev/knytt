'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

// Single brand - Faherty
const BRAND = {
  name: 'Faherty',
  logo: '/logos/brands/faherty.svg', // Change to .png if using PNG
};

export function BrandMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  // Repeat logo 10 times for seamless infinite scroll
  const repeatedLogos = Array(10).fill(BRAND);

  return (
    <section
      className="relative bg-ivory py-12 overflow-hidden border-y border-light-gray"
      aria-label="Featured brand partner"
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-wider text-gray/70 font-medium">
          Featured Brand Partner
        </p>
      </div>

      {/* Marquee Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none" />

        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <motion.div
          className="flex gap-20 md:gap-32 items-center"
          animate={{
            x: isPaused ? 0 : [0, -1600],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
        >
          {repeatedLogos.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="flex-shrink-0">
              <div className="relative h-16 w-32 md:h-20 md:w-40 lg:h-24 lg:w-48">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
