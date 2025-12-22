"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OutfitSlot } from "@/types/outfit";
import { EmptySlot } from "./EmptySlot";

interface OutfitSlotCardProps {
  slot: OutfitSlot;
  onAddItem: () => void;
  onRemoveItem: () => void;
  isSelected?: boolean;
}

export function OutfitSlotCard({
  slot,
  onAddItem,
  onRemoveItem,
  isSelected = false,
}: OutfitSlotCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  // Empty slot
  if (!slot.item) {
    return <EmptySlot slotType={slot.type} onClick={onAddItem} />;
  }

  // Filled slot
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
      className={`group relative w-full aspect-[3/4] border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] ${
        isSelected
          ? "border-[#8a94ff] shadow-lg shadow-[#8a94ff]/20"
          : "border-[#8a94ff]/30 hover:border-[#8a94ff] hover:shadow-lg"
      }`}
      onClick={onAddItem}
    >
      {/* Product Image */}
      <div className="relative w-full h-full bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-shimmer" />
        )}
        <Image
          src={slot.item.image_url}
          alt={slot.item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Slot Label Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            {slot.label}
          </span>
        </div>

        {/* Remove Button */}
        <AnimatePresence>
          {showRemove && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem();
              }}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 active:scale-95 z-10"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
        <div className="space-y-1">
          {/* Brand */}
          {slot.item.brand && (
            <p className="text-xs text-white/80 uppercase tracking-wide">
              {slot.item.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-bold text-white line-clamp-2">
            {slot.item.title}
          </h3>

          {/* Price */}
          <p className="text-lg font-bold text-white">
            {slot.item.currency}
            {slot.item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Hover Ring Effect */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-[#8a94ff]/0 group-hover:ring-[#8a94ff]/50 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
}
