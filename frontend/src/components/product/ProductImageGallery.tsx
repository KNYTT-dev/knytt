"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  mainImage: string | null;
  additionalImages?: string[];
  productTitle: string;
}

export function ProductImageGallery({
  mainImage,
  additionalImages = [],
  productTitle,
}: ProductImageGalleryProps) {
  const allImages = mainImage
    ? [mainImage, ...additionalImages.filter(Boolean)]
    : additionalImages.filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasMultipleImages = allImages.length > 1;
  const currentImage = allImages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (!currentImage || allImages.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-blush rounded-2xl flex items-center justify-center">
        <div className="text-center text-sage">
          <div className="w-20 h-20 mx-auto mb-4 bg-sage/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="aspect-[3/4] relative">
          <img
            src={currentImage}
            alt={productTitle}
            className="w-full h-full object-cover"
          />

          {/* Zoom Button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ZoomIn className="w-5 h-5 text-evergreen" />
          </button>

          {/* Navigation Arrows (if multiple images) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-evergreen" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-6 h-6 text-evergreen" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-sage ring-2 ring-sage/20"
                  : "border-blush hover:border-sage/50"
              }`}
            >
              <img
                src={image}
                alt={`${productTitle} - View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
