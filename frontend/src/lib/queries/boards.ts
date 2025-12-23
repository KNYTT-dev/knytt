/**
 * Board Query Hooks
 * React Query hooks for Pinterest-style board functionality
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Board,
  BoardDetail,
  BoardListResponse,
  BoardCreateRequest,
  BoardUpdateRequest,
  BoardItemCreateRequest,
  BoardItemUpdateRequest,
  BoardItem,
} from "@/types";

// Use environment variable for API URL (defaults to localhost for development)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Hook to get all boards for the current user
 */
export function useBoards(userId: string | undefined) {
  return useQuery({
    queryKey: ["boards", "me"],
    queryFn: async (): Promise<BoardListResponse> => {
      const response = await fetch(`${API_URL}/api/v1/boards/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to load boards");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get a board with all its items
 */
export function useBoardDetail(boardId: string | undefined) {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: async (): Promise<BoardDetail> => {
      const response = await fetch(`${API_URL}/api/v1/boards/${boardId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to load board");
      }

      return response.json();
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get boards that contain a specific product
 */
export function useBoardsWithProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ["boards", "product", productId],
    queryFn: async (): Promise<Board[]> => {
      const response = await fetch(
        `${API_URL}/api/v1/boards/product/${productId}/boards`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to load boards");
      }

      return response.json();
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to create a new board
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BoardCreateRequest): Promise<Board> => {
      const response = await fetch(`${API_URL}/api/v1/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create board");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate boards list to show new board
      queryClient.invalidateQueries({
        queryKey: ["boards", "me"],
      });
    },
  });
}

/**
 * Hook to update a board
 */
export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      updates: BoardUpdateRequest;
    }): Promise<Board> => {
      const response = await fetch(
        `${API_URL}/api/v1/boards/${data.boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.updates),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update board");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate both board list and detail views
      queryClient.invalidateQueries({
        queryKey: ["boards", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.boardId],
      });
    },
  });
}

/**
 * Hook to delete a board
 */
export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId: string): Promise<void> => {
      const response = await fetch(`${API_URL}/api/v1/boards/${boardId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to delete board");
      }

      // 204 No Content - no response body
      return;
    },
    onSuccess: (_, boardId) => {
      // Remove board from cache
      queryClient.invalidateQueries({
        queryKey: ["boards", "me"],
      });
      queryClient.removeQueries({
        queryKey: ["boards", boardId],
      });
    },
  });
}

/**
 * Hook to add a product to a board
 */
export function useAddToBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      item: BoardItemCreateRequest;
    }): Promise<BoardItem> => {
      const response = await fetch(
        `${API_URL}/api/v1/boards/${data.boardId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.item),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to add product to board");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate board detail and board list (for updated item count)
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards", "me"],
      });
      // Invalidate boards for this product
      queryClient.invalidateQueries({
        queryKey: ["boards", "product", variables.item.product_id],
      });
    },
  });
}

/**
 * Hook to remove a product from a board
 */
export function useRemoveFromBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      productId: string;
    }): Promise<void> => {
      const response = await fetch(
        `${API_URL}/api/v1/boards/${data.boardId}/items/${data.productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to remove product from board");
      }

      // 204 No Content - no response body
      return;
    },
    onSuccess: (_, variables) => {
      // Invalidate board detail and board list
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards", "me"],
      });
      // Invalidate boards for this product
      queryClient.invalidateQueries({
        queryKey: ["boards", "product", variables.productId],
      });
    },
  });
}

/**
 * Hook to update a board item (note or position)
 */
export function useUpdateBoardItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      productId: string;
      updates: BoardItemUpdateRequest;
    }): Promise<BoardItem> => {
      const response = await fetch(
        `${API_URL}/api/v1/boards/${data.boardId}/items/${data.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.updates),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update board item");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate board detail to show updated item
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.boardId],
      });
    },
  });
}
