"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductResult } from "@/types/api";
import { Heart, ShoppingCart } from "lucide-react";
import { useTrackInteraction } from "@/lib/queries/feedback";
import { InteractionType } from "@/types/enums";
import Link from "next/link";

interface CarouselCardProps {
  product: ProductResult;
  userId?: string; // UUID string
  context: string;
  onLike: (productId: string, e: React.MouseEvent) => void;
  onAddToCart: (productId: string, e: React.MouseEvent) => void;
  onClick: (productId: string) => void;
}

function CarouselCard({ product, userId, context, onLike, onAddToCart, onClick }: CarouselCardProps) {
  const [imageError, setImageError] = useState(false);

  // Don't render card if image failed to load
  if (imageError) {
    return null;
  }

  return (
    <Link
      href={`/products/${product.product_id}`}
      onClick={() => onClick(product.product_id)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-blush">
        <Image
          src={product.image_url!}
          alt={product.title}
          fill
          sizes="256px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={() => setImageError(true)}
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            {/* Price */}
            <div className="text-white">
              <p className="text-xl font-bold">
                {product.currency || "$"}
                {product.price?.toFixed(2) || "0.00"}
              </p>
              {product.rrp_price && product.rrp_price > product.price && (
                <p className="text-sm line-through opacity-75">
                  {product.currency || "$"}
                  {product.rrp_price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => onLike(product.product_id, e)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                aria-label="Like product"
              >
                <Heart className="w-4 h-4 text-terracotta" />
              </button>
              <button
                onClick={(e) => onAddToCart(product.product_id, e)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                // disabled={!product.in_stock} // TEMPORARY: Disabled until data re-ingestion
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4 text-sage" />
                {/* TEMPORARY: Stock-based styling disabled */}
                {/* <ShoppingCart className={`w-4 h-4 ${product.in_stock ? "text-sage" : "text-gray-400"}`} /> */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-sage uppercase tracking-wide mb-1 font-medium">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-evergreen line-clamp-2 group-hover:text-sage transition-colors">
          {product.title}
        </h3>
      </div>
    </Link>
  );
}

interface RecommendationCarouselProps {
  title: string;
  products: ProductResult[];
  userId?: string;
  context?: string;
  isLoading?: boolean;
}

export function RecommendationCarousel({
  title,
  products,
  userId,
  context = "recommendation",
  isLoading = false,
}: RecommendationCarouselProps) {
  const feedbackMutation = useTrackInteraction();

  const handleLike = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    feedbackMutation.mutate({
      user_id: userId,
      product_id: productId,
      interaction_type: InteractionType.LIKE,
      context,
    });
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    feedbackMutation.mutate({
      user_id: userId,
      product_id: productId,
      interaction_type: InteractionType.ADD_TO_CART,
      context,
    });
  };

  const handleClick = (productId: string) => {
    if (!userId) return;
    feedbackMutation.mutate({
      user_id: userId,
      product_id: productId,
      interaction_type: InteractionType.CLICK,
      context,
    });
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-evergreen mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-full h-96 bg-blush rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Filter out products without valid images (safety net)
  const validProducts = products?.filter(p => p.image_url?.trim()) || [];

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Title */}
      <h2 className="text-2xl font-bold text-evergreen mb-6">{title}</h2>

      {/* Products Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {validProducts.map((product) => (
          <CarouselCard
            key={product.product_id}
            product={product}
            userId={userId}
            context={context}
            onLike={handleLike}
            onAddToCart={handleAddToCart}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
