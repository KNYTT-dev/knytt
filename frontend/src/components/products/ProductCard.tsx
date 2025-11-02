"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { ProductResult } from "@/types/api";
import { InteractionType } from "@/types/enums";
import { useTrackInteraction } from "@/lib/queries/feedback";

interface ProductCardProps {
  product: ProductResult;
  userId?: number;
  onProductClick?: (productId: string) => void;
}

export function ProductCard({ product, userId, onProductClick }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const feedbackMutation = useTrackInteraction();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!userId) {
      console.warn("User ID required for interactions");
      return;
    }

    setIsLiked(!isLiked);

    feedbackMutation.mutate({
      user_id: userId,
      product_id: product.product_id,
      interaction_type: InteractionType.LIKE,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!userId) {
      console.warn("User ID required for interactions");
      return;
    }

    feedbackMutation.mutate({
      user_id: userId,
      product_id: product.product_id,
      interaction_type: InteractionType.ADD_TO_CART,
    });

    // TODO: Add to actual cart state
    console.log("Added to cart:", product.title);
  };

  const handleCardClick = () => {
    if (userId) {
      feedbackMutation.mutate({
        user_id: userId,
        product_id: product.product_id,
        interaction_type: InteractionType.CLICK,
      });
    }

    if (onProductClick) {
      onProductClick(product.product_id);
    }
  };

  const formatPrice = () => {
    if (!product.price) return "Price not available";
    return `${product.currency || "$"}${product.price.toFixed(2)}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {/* Like Button Overlay */}
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors ${
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={isLiked ? "Unlike product" : "Like product"}
        >
          <Heart
            className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
          />
        </button>

        {/* Stock Badge */}
        {product.in_stock !== undefined && (
          <div className="absolute bottom-2 left-2">
            {product.in_stock ? (
              <span className="px-2 py-1 text-xs font-medium bg-green-500/90 text-white rounded">
                In Stock
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-red-500/90 text-white rounded">
                Out of Stock
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.round(product.rating!)
                      ? "text-yellow-400"
                      : "text-muted"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {product.review_count && product.review_count > 0 && (
              <span className="text-xs text-muted-foreground">
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price and Cart Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {formatPrice()}
            </span>
            {product.quality_score && product.quality_score < 1 && (
              <span className="text-xs text-muted-foreground">
                Quality: {(product.quality_score * 100).toFixed(0)}%
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className={`p-2 rounded-full transition-colors ${
              product.in_stock
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Relevance Score (for debugging/demo) */}
        {product.final_score && (
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Match: {(product.final_score * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
