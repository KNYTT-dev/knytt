"use client";

import { ProductResult } from "@/types/api";
import { Star, Award, Package } from "lucide-react";

interface ProductInfoProps {
  product: ProductResult;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const hasRating = product.rating && product.rating > 0;
  const hasQualityScore = product.quality_score && product.quality_score < 1;

  return (
    <div className="space-y-6">
      {/* Brand & Category */}
      <div className="flex flex-wrap items-center gap-3">
        {product.brand && (
          <span className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-sage bg-sage/10 rounded-full">
            {product.brand}
          </span>
        )}
        {product.category_name && (
          <span className="px-3 py-1 text-xs font-medium text-evergreen/60 bg-blush rounded-full">
            {product.category_name}
          </span>
        )}
        {product.fashion_category && (
          <span className="px-3 py-1 text-xs font-medium text-evergreen/60 bg-blush rounded-full">
            {product.fashion_category}
          </span>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-evergreen leading-tight">
          {product.title}
        </h1>
      </div>

      {/* Rating & Reviews */}
      {hasRating && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating!)
                    ? "text-terracotta fill-terracotta"
                    : "text-blush fill-blush"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-evergreen">
            {product.rating.toFixed(1)}
          </span>
          {product.review_count && product.review_count > 0 && (
            <span className="text-sm text-evergreen/60">
              ({product.review_count} {product.review_count === 1 ? "review" : "reviews"})
            </span>
          )}
        </div>
      )}

      {/* Quality Score Badge */}
      {hasQualityScore && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blush/50 rounded-lg">
          <Award className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium text-evergreen">
            Quality Score: {(product.quality_score * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div>
          <p className="text-base text-evergreen/80 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Specifications */}
      <div className="border-t border-blush pt-6">
        <h2 className="text-xl font-bold text-evergreen mb-4">
          Product Details
        </h2>
        <dl className="grid grid-cols-1 gap-3">
          {product.colour && (
            <div className="flex justify-between py-2 border-b border-blush/50">
              <dt className="text-sm font-medium text-evergreen/60">Color</dt>
              <dd className="text-sm font-medium text-evergreen">{product.colour}</dd>
            </div>
          )}
          {product.fashion_size && (
            <div className="flex justify-between py-2 border-b border-blush/50">
              <dt className="text-sm font-medium text-evergreen/60">Size</dt>
              <dd className="text-sm font-medium text-evergreen">{product.fashion_size}</dd>
            </div>
          )}
          {product.merchant_name && (
            <div className="flex justify-between py-2 border-b border-blush/50">
              <dt className="text-sm font-medium text-evergreen/60">Merchant</dt>
              <dd className="text-sm font-medium text-evergreen">{product.merchant_name}</dd>
            </div>
          )}
          {product.product_url && (
            <div className="flex justify-between py-2 border-b border-blush/50">
              <dt className="text-sm font-medium text-evergreen/60">Product URL</dt>
              <dd className="text-sm font-medium">
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage hover:text-terracotta transition-colors underline"
                >
                  View on merchant site
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Merchant Information */}
      {product.merchant_name && (
        <div className="bg-gradient-to-r from-ivory to-blush rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Package className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-evergreen mb-1">
                Sold by {product.merchant_name}
              </h3>
              <p className="text-xs text-evergreen/60">
                This product is fulfilled by the merchant
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
