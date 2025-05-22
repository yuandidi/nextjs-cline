// Store for visited routes
let visitedRoutes = new Set<string>();

/**
 * Check if a route has been visited before
 * @param routeKey - The unique key for the route (path + search params)
 * @returns boolean indicating if the route has been visited
 */
export function hasVisitedRoute(routeKey: string): boolean {
  return visitedRoutes.has(routeKey);
}

/**
 * Mark a route as visited
 * @param routeKey - The unique key for the route (path + search params)
 */
export function markRouteAsVisited(routeKey: string): void {
  visitedRoutes.add(routeKey);
}

/**
 * Clear the entire route cache
 */
export function clearRouteCache(): void {
  visitedRoutes = new Set<string>();
}

/**
 * Clear a specific route from the cache
 * @param routeKey - The unique key for the route to clear
 */
export function clearRoute(routeKey: string): void {
  visitedRoutes.delete(routeKey);
}

/**
 * Generate a unique key for a route
 * @param path - The pathname
 * @param params - The search parameters
 * @returns A unique string key for the route
 */
export function getRouteKey(path: string, params: URLSearchParams): string {
  const searchString = params.toString();
  return `${path}${searchString ? `?${searchString}` : ''}`;
}
