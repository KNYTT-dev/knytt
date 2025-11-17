/**
 * User Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserStatsResponse,
  InteractionHistoryResponse,
  FavoritesResponse,
  UserPreferencesUpdate,
} from "@/types/api";

// Use environment variable for API URL (defaults to localhost for development)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Hook to get user statistics
 */
export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", "stats", "me"],
    queryFn: async (): Promise<UserStatsResponse> => {
      const response = await fetch(`${API_URL}/api/v1/users/me/stats`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to load user stats");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get user interaction history
 */
export function useInteractionHistory(
  userId: string | undefined,
  options?: { offset?: number; limit?: number }
) {
  return useQuery({
    queryKey: ["user", "history", "me", options],
    queryFn: async (): Promise<InteractionHistoryResponse> => {
      const params = new URLSearchParams();
      if (options?.offset) params.append("offset", options.offset.toString());
      if (options?.limit) params.append("limit", options.limit.toString());

      const response = await fetch(
        `${API_URL}/api/v1/users/me/history?${params}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to load interaction history");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get user favorites
 */
export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", "favorites", "me"],
    queryFn: async (): Promise<FavoritesResponse> => {
      const response = await fetch(
        `${API_URL}/api/v1/users/me/favorites`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to load favorites");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update user preferences
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      preferences: UserPreferencesUpdate;
    }) => {
      const response = await fetch(
        `${API_URL}/api/v1/users/me/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.preferences),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update preferences");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate auth query to refresh user object with new preferences
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "stats", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendations", "feed", variables.userId],
      });
    },
  });
}

/**
 * Hook to remove a favorite
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; productId: string }) => {
      console.log("useRemoveFavorite: Sending DELETE request", data);
      const response = await fetch(
        `${API_URL}/api/v1/users/me/favorites/${data.productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("useRemoveFavorite: Response status", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("useRemoveFavorite: Error response", error);
        throw new Error(error.message || "Failed to remove favorite");
      }

      // 204 No Content - no response body to parse
      console.log("useRemoveFavorite: Success - favorite removed");
      return null;
    },
    onSuccess: () => {
      console.log("useRemoveFavorite: Invalidating favorites query");
      queryClient.invalidateQueries({
        queryKey: ["user", "favorites", "me"],
      });
    },
  });
}
