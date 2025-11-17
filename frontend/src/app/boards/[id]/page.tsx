"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Unlock, Trash2, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/queries/auth";
import { useBoardDetail, useRemoveFromBoard, useDeleteBoard } from "@/lib/queries/boards";
import { BoardItem } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BoardDetailPage({ params }: PageProps) {
  const { id: boardId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: board, isLoading } = useBoardDetail(boardId);
  const removeFromBoard = useRemoveFromBoard();
  const deleteBoard = useDeleteBoard();

  const handleRemoveItem = async (productId: string) => {
    if (!confirm("Remove this item from the board?")) return;

    try {
      await removeFromBoard.mutateAsync({ boardId, productId });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleDeleteBoard = async () => {
    if (!board) return;

    if (board.is_default) {
      alert("Cannot delete the default board");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${board.name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await deleteBoard.mutateAsync(boardId);
      router.push("/profile");
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sage animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-evergreen mb-4">
            Board not found
          </h1>
          <Link
            href="/profile"
            className="text-sage hover:text-evergreen transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === board.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sage hover:text-evergreen transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Boards</span>
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-evergreen">
                  {board.name}
                </h1>
                {board.is_public ? (
                  <Unlock className="w-6 h-6 text-sage" />
                ) : (
                  <Lock className="w-6 h-6 text-evergreen" />
                )}
              </div>
              {board.description && (
                <p className="text-evergreen/60 text-lg mb-2">
                  {board.description}
                </p>
              )}
              <p className="text-evergreen/50">
                {board.items.length}{" "}
                {board.items.length === 1 ? "item" : "items"}
              </p>
            </div>

            {isOwner && !board.is_default && (
              <button
                onClick={handleDeleteBoard}
                disabled={deleteBoard.isPending}
                className="px-4 py-2 rounded-full border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Board</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {board.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-evergreen mb-2">
                No Items Yet
              </h3>
              <p className="text-evergreen/60">
                Start adding products to this board to build your collection!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {board.items.map((item) => (
              <BoardItemCard
                key={item.id}
                item={item}
                onRemove={isOwner ? () => handleRemoveItem(item.product_id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Board Item Card Component
interface BoardItemCardProps {
  item: BoardItem;
  onRemove?: () => void;
}

function BoardItemCard({ item, onRemove }: BoardItemCardProps) {
  const { product } = item;
  const imageUrl =
    product.merchant_image_url ||
    product.aw_image_url ||
    product.large_image ||
    "/placeholder.jpg";

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-blush/20">
          <Image
            src={imageUrl}
            alt={product.product_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Stock indicator */}
          {!product.in_stock && (
            <div className="absolute top-3 left-3 bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </div>
          )}

          {/* Remove button */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <Trash2 className="w-4 h-4 text-terracotta" />
            </button>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/products/${product.id}`} className="block p-4">
        <h3 className="font-semibold text-evergreen line-clamp-2 mb-1 group-hover:text-sage transition-colors">
          {product.product_name}
        </h3>
        {product.brand_name && (
          <p className="text-sm text-evergreen/60 mb-2">{product.brand_name}</p>
        )}
        {product.search_price && (
          <p className="text-lg font-bold text-sage">
            {product.currency} {product.search_price.toFixed(2)}
          </p>
        )}

        {/* Note */}
        {item.note && (
          <p className="text-sm text-evergreen/70 italic mt-2 line-clamp-2">
            "{item.note}"
          </p>
        )}
      </Link>
    </div>
  );
}
