"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/lib/queries/auth";

/**
 * AuthProvider Component
 * Initializes authentication by fetching current user on app load.
 * Should wrap the entire app to ensure auth state is loaded.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fetch current user on mount
  // This will automatically update the auth store if user is authenticated
  const { isLoading, error } = useCurrentUser();

  // Don't block render while checking auth
  // The app will work fine, just won't show auth state until loaded
  return <>{children}</>;
}
