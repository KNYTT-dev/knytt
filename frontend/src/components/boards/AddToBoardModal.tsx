"use client";

import { useState, useEffect } from "react";
import { X, Plus, Check, Loader2 } from "lucide-react";
import { useBoards, useAddToBoard, useCreateBoard } from "@/lib/queries/boards";
import { useAuth } from "@/lib/queries/auth";

interface AddToBoardModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  boardsWithProduct?: string[]; // IDs of boards that already have this product
}

export function AddToBoardModal({
  productId,
  isOpen,
  onClose,
  boardsWithProduct = [],
}: AddToBoardModalProps) {
  const { user } = useAuth();
  const { data: boardsData, isLoading } = useBoards(user?.id);
  const addToBoard = useAddToBoard();
  const createBoard = useCreateBoard();

  const [newBoardName, setNewBoardName] = useState("");
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewBoardName("");
      setShowNewBoardInput(false);
    }
  }, [isOpen]);

  const handleAddToBoard = async (boardId: string) => {
    try {
      await addToBoard.mutateAsync({
        boardId,
        item: { product_id: productId },
      });
    } catch (error) {
      console.error("Error adding to board:", error);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newBoardName.trim()) return;

    try {
      const newBoard = await createBoard.mutateAsync({
        name: newBoardName.trim(),
        is_public: false,
      });

      // Add product to the newly created board
      await addToBoard.mutateAsync({
        boardId: newBoard.id,
        item: { product_id: productId },
      });

      setNewBoardName("");
      setShowNewBoardInput(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blush">
          <h2 className="text-2xl font-semibold text-evergreen">
            Save to Board
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blush/20 transition-colors"
          >
            <X className="w-5 h-5 text-evergreen" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-sage animate-spin" />
            </div>
          ) : (
            <>
              {/* Existing Boards */}
              <div className="space-y-2">
                {boardsData?.boards.map((board) => {
                  const isAdded = boardsWithProduct.includes(board.id);
                  const isLoading = addToBoard.isPending;

                  return (
                    <button
                      key={board.id}
                      onClick={() => !isAdded && handleAddToBoard(board.id)}
                      disabled={isAdded || isLoading}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isAdded
                          ? "border-sage bg-sage/10 cursor-default"
                          : "border-blush hover:border-sage hover:bg-blush/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-evergreen truncate">
                            {board.name}
                          </h3>
                          <p className="text-sm text-evergreen/60">
                            {board.item_count}{" "}
                            {board.item_count === 1 ? "item" : "items"}
                          </p>
                        </div>
                        {isAdded && (
                          <div className="ml-2 flex-shrink-0">
                            <Check className="w-5 h-5 text-sage" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Create New Board */}
              {!showNewBoardInput ? (
                <button
                  onClick={() => setShowNewBoardInput(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-sage text-sage hover:bg-sage/10 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Create New Board</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl border-2 border-sage bg-sage/5 space-y-3">
                  <input
                    type="text"
                    placeholder="Board name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateAndAdd();
                      } else if (e.key === "Escape") {
                        setShowNewBoardInput(false);
                        setNewBoardName("");
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border-2 border-blush focus:border-sage focus:outline-none transition-colors"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateAndAdd}
                      disabled={
                        !newBoardName.trim() ||
                        createBoard.isPending ||
                        addToBoard.isPending
                      }
                      className="flex-1 px-4 py-2 rounded-lg bg-sage text-white font-medium hover:bg-evergreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {createBoard.isPending || addToBoard.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create & Save</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowNewBoardInput(false);
                        setNewBoardName("");
                      }}
                      className="px-4 py-2 rounded-lg border-2 border-blush text-evergreen hover:bg-blush/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
