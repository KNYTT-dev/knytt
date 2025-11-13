/**
 * Search Query Hooks
 */

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { SearchRequest, SearchResponse, ProductResult } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

/**
 * Hook to search for products
 */
export function useSearch(
  request: SearchRequest,
  options?: Omit<UseQueryOptions<SearchResponse>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["search", request],
    queryFn: async (): Promise<SearchResponse> => {
      const response = await fetch(`${API_URL}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }

      return response.json();
    },
    enabled: !!request.query, // Only run if query is not empty
    ...options,
  });
}

/**
 * Hook for infinite scroll search
 */
export function useInfiniteSearch(
  baseRequest: Omit<SearchRequest, "offset">,
  options?: Omit<
    UseInfiniteQueryOptions<SearchResponse, Error, any, any, number>,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >
) {
  return useInfiniteQuery<SearchResponse, Error, any, any, number>({
    queryKey: ["search", "infinite", baseRequest],
    queryFn: async ({ pageParam }: { pageParam: number }): Promise<SearchResponse> => {
      const request: SearchRequest = {
        ...baseRequest,
        offset: pageParam as number,
      };

      const response = await fetch(`${API_URL}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }

      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled: !!baseRequest.query,
    ...options,
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(
  productId: string,
  options?: Omit<UseQueryOptions<ProductResult>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductResult> => {
      const response = await fetch(`${API_URL}/api/v1/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch product");
      }

      return response.json();
    },
    enabled: !!productId,
    ...options,
  });
}
