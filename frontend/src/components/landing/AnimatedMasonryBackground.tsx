'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  image_url: string;
  title: string;
}

export default function AnimatedMasonryBackground() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Fetch products for background
    fetch('/api/discover?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  // Split products into 4 columns
  const columns = [
    products.filter((_, i) => i % 4 === 0),
    products.filter((_, i) => i % 4 === 1),
    products.filter((_, i) => i % 4 === 2),
    products.filter((_, i) => i % 4 === 3),
  ];

  const columnDurations = [30, 25, 35, 28]; // Different speeds for parallax effect

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Pause button for accessibility */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all"
        aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>

      {/* Masonry columns */}
      <div className="flex h-[200vh] gap-2 sm:gap-4">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="flex-1 flex flex-col gap-2 sm:gap-4"
            animate={{
              y: isPaused ? 0 : [0, -1000],
            }}
            transition={{
              duration: columnDurations[columnIndex],
              repeat: Infinity,
              ease: 'linear',
              delay: columnIndex * 2,
            }}
          >
            {/* Duplicate images for seamless loop */}
            {[...column, ...column].map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="relative w-full rounded-lg overflow-hidden"
                style={{
                  height: `${200 + Math.random() * 100}px`,
                }}
              >
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
