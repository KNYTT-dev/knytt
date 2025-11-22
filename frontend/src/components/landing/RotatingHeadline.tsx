'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  'fashion inspiration',
  'style discovery',
  'wardrobe essential',
  'trending accessory',
];

export default function RotatingHeadline() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h2 className="text-2xl sm:text-3xl font-semibold text-[#333333] mb-6">
      Get your next{' '}
      <span className="inline-block min-w-[200px] text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[#8a94ff]"
          >
            {phrases[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h2>
  );
}
