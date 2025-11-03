"use client";

import { ProductResult } from "@/types/api";
import { CheckCircle, XCircle, Package } from "lucide-react";

interface ProductPricingProps {
  product: ProductResult;
}

export function ProductPricing({ product }: ProductPricingProps) {
  const hasRRP = product.rrp_price && product.rrp_price > product.price;
  const discount = hasRRP
    ? Math.round(((product.rrp_price! - product.price) / product.rrp_price!) * 100)
    : 0;

  const formatPrice = (price: number, currency: string) => {
    // Handle common currency symbols
    const currencySymbol = currency === "USD" || currency === "$" ? "$" : currency;
    return `${currencySymbol}${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      {/* Price Section */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-terracotta">
            {formatPrice(product.price, product.currency || "USD")}
          </span>
          {hasRRP && (
            <>
              <span className="text-xl text-evergreen/40 line-through">
                {formatPrice(product.rrp_price!, product.currency || "USD")}
              </span>
              <span className="px-2 py-1 text-sm font-bold text-white bg-terracotta rounded-full">
                -{discount}%
              </span>
            </>
          )}
        </div>
        {hasRRP && (
          <p className="text-sm text-evergreen/60">
            You save {formatPrice(product.rrp_price! - product.price, product.currency || "USD")}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="border-t border-blush pt-4">
        {product.in_stock ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">In Stock</span>
            {product.stock_quantity && product.stock_quantity > 0 && (
              <span className="text-sm text-evergreen/60">
                ({product.stock_quantity} available)
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Shipping Info */}
      <div className="bg-gradient-to-r from-sage/10 to-blush/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-evergreen mb-1">
              Fast & Reliable Shipping
            </p>
            <p className="text-xs text-evergreen/60">
              Fulfilled by merchant. Shipping times may vary.
            </p>
          </div>
        </div>
      </div>

      {/* Price History / Additional Info */}
      {product.quality_score && (
        <div className="text-xs text-evergreen/50 text-center">
          Quality score: {(product.quality_score * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
