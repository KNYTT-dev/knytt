"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Save } from "lucide-react";
import { useOutfitStore } from "@/lib/stores/outfitStore";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

interface OutfitSummaryProps {
  onSave: () => void;
}

export function OutfitSummary({ onSave }: OutfitSummaryProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const toast = useToast();

  const getTotalPrice = useOutfitStore((state) => state.getTotalPrice);
  const getFilledCount = useOutfitStore((state) => state.getFilledCount);
  const canAddToCart = useOutfitStore((state) => state.canAddToCart);
  const clearCurrentOutfit = useOutfitStore((state) => state.clearCurrentOutfit);
  const addAllToCart = useOutfitStore((state) => state.addAllToCart);

  const filledCount = getFilledCount();
  const totalPrice = getTotalPrice();
  const hasItems = canAddToCart();

  const handleAddAllToCart = () => {
    addAllToCart();
    toast.success(
      "Added to cart",
      `${filledCount} item${filledCount !== 1 ? "s" : ""} added to your cart`
    );
  };

  const handleClear = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    clearCurrentOutfit();
    setShowClearConfirm(false);
    toast.info("Outfit cleared", "All items have been removed");
  };

  const handleSave = () => {
    if (!hasItems) {
      toast.warning("Cannot save empty outfit", "Add at least one item first");
      return;
    }
    onSave();
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6 sticky top-24">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-charcoal mb-1">Your Outfit</h3>
        <p className="text-xs text-gray-500">
          {filledCount === 0
            ? "Start adding items to your outfit"
            : filledCount === 5
            ? "Your outfit is complete!"
            : "Keep building your look"}
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {/* Item Count */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-semibold text-charcoal">
            {filledCount} / 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8a94ff] to-[#6a7ae0] transition-all duration-500 ease-out"
            style={{ width: `${(filledCount / 5) * 100}%` }}
          />
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total:</span>
          <span className="text-2xl font-bold text-[#8a94ff]">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Add All to Cart */}
        <Button
          variant="primary"
          onClick={handleAddAllToCart}
          disabled={!hasItems}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
          className="w-full"
        >
          Add All to Cart
        </Button>

        {/* Save Outfit */}
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={!hasItems}
          leftIcon={<Save className="w-4 h-4" />}
          className="w-full"
        >
          Save Outfit
        </Button>

        {/* Clear Outfit */}
        {hasItems && (
          <Button
            variant={showClearConfirm ? "danger" : "ghost"}
            onClick={handleClear}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="w-full"
          >
            {showClearConfirm ? "Click again to confirm" : "Clear Outfit"}
          </Button>
        )}
      </div>

      {/* Empty State Help Text */}
      {!hasItems && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Click on any slot above to start browsing and adding items to your
            outfit
          </p>
        </div>
      )}
    </div>
  );
}
