"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { clearRoute, clearRouteCache, getRouteKey } from "@/lib/routeCache";

/**
 * Hook to manage route cache for loading animations
 * 
 * @returns Object with functions to manage route cache
 */
export function useRouteCache() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  /**
   * Clear the current route from cache to show loading animation on next visit
   */
  const clearCurrentRoute = useCallback(() => {
    const currentRouteKey = getRouteKey(pathname, searchParams as unknown as URLSearchParams);
    clearRoute(currentRouteKey);
  }, [pathname, searchParams]);
  
  /**
   * Clear a specific route from cache
   * 
   * @param path - The pathname
   * @param params - The search parameters (optional)
   */
  const clearSpecificRoute = useCallback((path: string, params?: URLSearchParams) => {
    const routeParams = params || new URLSearchParams();
    const routeKey = getRouteKey(path, routeParams);
    clearRoute(routeKey);
  }, []);
  
  /**
   * Clear all routes from cache
   */
  const clearAllRoutes = useCallback(() => {
    clearRouteCache();
  }, []);
  
  return {
    clearCurrentRoute,
    clearSpecificRoute,
    clearAllRoutes
  };
}
