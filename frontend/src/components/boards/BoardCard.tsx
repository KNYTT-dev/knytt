"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Unlock } from "lucide-react";
import { Board } from "@/types";

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  // Use cover image or placeholder
  const coverImage = board.cover_image_url || "/placeholder-board.jpg";

  return (
    <Link
      href={`/boards/${board.id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Board Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-blush/20">
        <Image
          src={coverImage}
          alt={board.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Privacy Indicator */}
        <div className="absolute top-3 right-3">
          {board.is_public ? (
            <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm">
              <Unlock className="w-4 h-4 text-sage" />
            </div>
          ) : (
            <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm">
              <Lock className="w-4 h-4 text-evergreen" />
            </div>
          )}
        </div>

        {/* Item Count Badge */}
        {board.item_count > 0 && (
          <div className="absolute bottom-3 right-3 bg-evergreen/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {board.item_count} {board.item_count === 1 ? "item" : "items"}
          </div>
        )}
      </div>

      {/* Board Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-evergreen truncate group-hover:text-sage transition-colors">
              {board.name}
              {board.is_default && (
                <span className="ml-2 text-xs text-terracotta font-normal">
                  (Default)
                </span>
              )}
            </h3>
            {board.description && (
              <p className="text-sm text-evergreen/60 mt-1 line-clamp-2">
                {board.description}
              </p>
            )}
          </div>
        </div>

        {/* Empty State */}
        {board.item_count === 0 && (
          <p className="text-xs text-evergreen/40 mt-2 italic">
            No items yet
          </p>
        )}
      </div>
    </Link>
  );
}
