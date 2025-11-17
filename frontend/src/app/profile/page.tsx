"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/queries/auth";
import { useBoards, useCreateBoard } from "@/lib/queries/boards";
import { BoardGrid } from "@/components/boards";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: boardsData, isLoading: boardsLoading } = useBoards(user?.id);
  const createBoard = useCreateBoard();

  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      await createBoard.mutateAsync({
        name: newBoardName.trim(),
        description: newBoardDescription.trim() || undefined,
        is_public: false,
      });

      // Reset form
      setNewBoardName("");
      setNewBoardDescription("");
      setShowNewBoardModal(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  if (authLoading || boardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sage animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-evergreen mb-4">
            Please log in to view your boards
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-evergreen mb-2">
              My Boards
            </h1>
            <p className="text-evergreen/60">
              Organize your favorite products into collections
            </p>
          </div>

          <button
            onClick={() => setShowNewBoardModal(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-sage to-evergreen text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Board</span>
          </button>
        </div>

        {/* Boards Grid */}
        <BoardGrid
          boards={boardsData?.boards || []}
          emptyMessage="Create your first board to start organizing your favorite products!"
        />

        {/* Create Board Modal */}
        {showNewBoardModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Modal Header */}
              <div className="p-6 border-b border-blush">
                <h2 className="text-2xl font-semibold text-evergreen">
                  Create New Board
                </h2>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleCreateBoard} className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="board-name"
                    className="block text-sm font-medium text-evergreen mb-2"
                  >
                    Board Name *
                  </label>
                  <input
                    id="board-name"
                    type="text"
                    placeholder="e.g., Summer Wardrobe, Gift Ideas"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blush focus:border-sage focus:outline-none transition-colors"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="board-description"
                    className="block text-sm font-medium text-evergreen mb-2"
                  >
                    Description (optional)
                  </label>
                  <textarea
                    id="board-description"
                    placeholder="What's this board for?"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blush focus:border-sage focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!newBoardName.trim() || createBoard.isPending}
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-sage to-evergreen text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {createBoard.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Board</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewBoardModal(false);
                      setNewBoardName("");
                      setNewBoardDescription("");
                    }}
                    className="px-6 py-3 rounded-full border-2 border-blush text-evergreen hover:bg-blush/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
