'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  image_url: string;
  title: string;
  brand?: string;
  price: number;
  currency: string;
}

const GRID_SIZE = 12; // 3x4 grid on desktop
const ROTATION_INTERVAL = 4000; // 4 seconds per card rotation

export default function AnimatedProductCardsBackground() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<(Product | null)[]>(
    Array(GRID_SIZE).fill(null)
  );
  const [isPaused, setIsPaused] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch('/api/discover?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          // Initialize grid with first products
          setDisplayedProducts(
            data.products.slice(0, GRID_SIZE).concat(Array(GRID_SIZE).fill(null)).slice(0, GRID_SIZE)
          );
        }
      })
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  // Rotate products randomly
  useEffect(() => {
    if (isPaused || products.length === 0) return;

    const interval = setInterval(() => {
      setDisplayedProducts((current) => {
        const newDisplayed = [...current];
        // Pick a random card position to update
        const randomIndex = Math.floor(Math.random() * GRID_SIZE);
        // Pick a random product
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        newDisplayed[randomIndex] = randomProduct;
        return newDisplayed;
      });
    }, ROTATION_INTERVAL / GRID_SIZE); // Stagger updates

    return () => clearInterval(interval);
  }, [products, isPaused]);

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

      {/* Product cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-full">
        {displayedProducts.map((product, index) => (
          <div key={index} className="relative aspect-[3/4]">
            <AnimatePresence mode="wait">
              {product && (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-3/4">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 h-1/4 flex flex-col justify-center">
                    {product.brand && (
                      <p className="text-xs font-semibold text-gray-600 uppercase truncate">
                        {product.brand}
                      </p>
                    )}
                    <p className="text-sm font-medium text-gray-900 truncate line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-[#8a94ff]">
                      {product.currency}
                      {product.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
    </div>
  );
}
