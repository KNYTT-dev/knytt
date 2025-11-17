"use client";

import { Board } from "@/types";
import { BoardCard } from "./BoardCard";

interface BoardGridProps {
  boards: Board[];
  emptyMessage?: string;
}

export function BoardGrid({
  boards,
  emptyMessage = "No boards yet. Create your first board to get started!",
}: BoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-evergreen mb-2">
            No Boards Yet
          </h3>
          <p className="text-evergreen/60">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
