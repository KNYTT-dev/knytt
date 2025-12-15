'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const BRANDS = [
  'Nike',
  'Adidas',
  'Puma',
  'The North Face',
  'Patagonia',
  'Columbia',
  'Timberland',
  'Dr. Martens',
  'Champion',
  'Fila',
  'New Balance',
  'Reebok',
  'Under Armour',
  'Asics',
  'Vans',
  'Converse',
  'Skechers',
  "Levi's",
  'Gap',
  'Faherty',
];

export function BrandMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      className="relative bg-ivory py-12 overflow-hidden border-y border-light-gray"
      aria-label="Partner brands"
    >
      {/* Optional: Small heading above */}
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-wider text-gray/70 font-medium">
          Partnered with Leading Brands
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

        {/* Scrolling content */}
        <motion.div
          className="flex gap-8 md:gap-12 lg:gap-16 items-center whitespace-nowrap"
          animate={{
            x: isPaused ? 0 : [0, -1920],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
        >
          {/* Duplicate items twice for seamless loop */}
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <div key={`${brand}-${index}`} className="flex items-center gap-4">
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray/40 transition-colors duration-300 hover:text-pinterest-red cursor-default">
                {brand}
              </span>
              {index < BRANDS.length * 2 - 1 && (
                <span className="text-gray/30 text-xl">•</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
