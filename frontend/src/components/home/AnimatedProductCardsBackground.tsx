'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  image_url: string;
  title: string;
}

// Create columns for masonry layout
const COLUMNS = 6; // 6 columns for full coverage
const ITEMS_PER_COLUMN = 4; // 4 items per column
const ROTATION_INTERVAL = 3000; // 3 seconds per image rotation

export default function AnimatedProductCardsBackground() {
  const [products, setProducts] = useState<Product[]>([]);
  const [columns, setColumns] = useState<Product[][]>(
    Array(COLUMNS)
      .fill(null)
      .map(() => [])
  );
  const [isPaused, setIsPaused] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch('/api/v1/discover?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setProducts(data.results);
          // Initialize columns with products
          const initialColumns = Array(COLUMNS)
            .fill(null)
            .map((_, colIndex) => {
              return Array(ITEMS_PER_COLUMN)
                .fill(null)
                .map((_, itemIndex) => {
                  const productIndex = (colIndex * ITEMS_PER_COLUMN + itemIndex) % data.results.length;
                  return data.results[productIndex];
                })
                .filter(Boolean);
            });
          setColumns(initialColumns);
        }
      })
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  // Rotate images randomly
  useEffect(() => {
    if (isPaused || products.length === 0) return;

    const interval = setInterval(() => {
      setColumns((currentColumns) => {
        const newColumns = currentColumns.map((column) => [...column]);
        // Pick a random column and position
        const randomCol = Math.floor(Math.random() * COLUMNS);
        const randomRow = Math.floor(Math.random() * ITEMS_PER_COLUMN);
        // Pick a random product
        const randomProduct = products[Math.floor(Math.random() * products.length)];

        if (newColumns[randomCol] && newColumns[randomCol][randomRow]) {
          newColumns[randomCol][randomRow] = randomProduct;
        }

        return newColumns;
      });
    }, ROTATION_INTERVAL / (COLUMNS * 2)); // Stagger updates across all images

    return () => clearInterval(interval);
  }, [products, isPaused]);

  // Varying heights for masonry effect
  const heights = ['250px', '300px', '350px', '280px', '320px', '270px'];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Pause button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all"
        aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>

      {/* Masonry columns - no gaps, full coverage */}
      <div className="flex w-full h-[150%] -mt-[25%]">
        {columns.map((column, colIndex) => (
          <motion.div
            key={colIndex}
            className="flex-1 flex flex-col"
            animate={{
              y: isPaused ? 0 : [-200, 0],
            }}
            transition={{
              duration: 20 + colIndex * 3,
              repeat: Infinity,
              ease: 'linear',
              delay: colIndex * 1.5,
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...column, ...column].map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="relative flex-shrink-0"
                style={{
                  height: heights[idx % heights.length],
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="17vw"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Strong dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
    </div>
  );
}
