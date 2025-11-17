"use client";

import { useState } from "react";
import { Bookmark, ShoppingCart, Check } from "lucide-react";
import { useTrackInteraction } from "@/lib/queries/feedback";
import { useBoardsWithProduct } from "@/lib/queries/boards";
import { InteractionType } from "@/types/enums";
import { AddToBoardModal } from "@/components/boards";

interface ProductActionsProps {
  productId: string;
  userId?: string;
  inStock: boolean;
}

export function ProductActions({
  productId,
  userId,
  inStock,
}: ProductActionsProps) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const feedbackMutation = useTrackInteraction();

  // Get boards that contain this product
  const { data: boardsWithProduct } = useBoardsWithProduct(
    userId ? productId : undefined
  );

  const isSavedToAnyBoard = (boardsWithProduct?.length || 0) > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    if (!userId) return; // Skip if not authenticated

    setIsAddedToCart(true);
    feedbackMutation.mutate({
      user_id: userId,
      product_id: productId,
      interaction_type: InteractionType.ADD_TO_CART,
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  const handleSaveToBoard = () => {
    if (!userId) return; // Skip if not authenticated
    setShowBoardModal(true);

    // Track like interaction when opening board modal
    feedbackMutation.mutate({
      user_id: userId,
      product_id: productId,
      interaction_type: InteractionType.LIKE,
    });
  };

  return (
    <>
      <div className="space-y-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full px-6 py-4 rounded-full font-semibold text-lg transition-all shadow-lg ${
            !inStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isAddedToCart
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-sage to-evergreen text-white hover:shadow-xl hover:scale-105"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {isAddedToCart ? (
              <>
                <Check className="w-6 h-6" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-6 h-6" />
                <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
              </>
            )}
          </span>
        </button>

        {/* Save to Board Button */}
        <button
          onClick={handleSaveToBoard}
          className={`w-full px-6 py-4 rounded-full font-semibold text-lg border-2 transition-all ${
            isSavedToAnyBoard
              ? "border-terracotta bg-terracotta/10 text-terracotta"
              : "border-blush bg-white text-evergreen hover:border-sage hover:text-sage"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Bookmark
              className={`w-6 h-6 transition-all ${
                isSavedToAnyBoard ? "fill-terracotta" : ""
              }`}
            />
            <span>
              {isSavedToAnyBoard
                ? `Saved to ${boardsWithProduct?.length} ${
                    boardsWithProduct?.length === 1 ? "board" : "boards"
                  }`
                : "Save to Board"}
            </span>
          </span>
        </button>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-evergreen/60">
            Free returns within 30 days • Secure checkout
          </p>
        </div>
      </div>

      {/* Add to Board Modal */}
      <AddToBoardModal
        productId={productId}
        isOpen={showBoardModal}
        onClose={() => setShowBoardModal(false)}
        boardsWithProduct={boardsWithProduct?.map((b) => b.id) || []}
      />
    </>
  );
}
