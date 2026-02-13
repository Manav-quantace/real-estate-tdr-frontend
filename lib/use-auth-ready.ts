"use client";

import { useAuth } from "./auth-context";

export function useAuthReady() {
  const { loading, isAuthenticated } = useAuth();

  return {
    ready: !loading,
    isAuthenticated,
  };
}
