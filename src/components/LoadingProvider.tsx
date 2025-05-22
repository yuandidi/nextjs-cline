"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { hasVisitedRoute, markRouteAsVisited, getRouteKey } from "@/lib/routeCache";

// NProgress configuration
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 500,
  showSpinner: false,
});

export default function LoadingProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use refs to track previous values for comparison
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams);
  
  useEffect(() => {
    // Only trigger loading animation when the path or search params actually change
    if (prevPathname.current !== pathname || prevSearchParams.current !== searchParams) {
      const currentRouteKey = getRouteKey(pathname, searchParams as unknown as URLSearchParams);
      const hasVisitedBefore = hasVisitedRoute(currentRouteKey);
      
      // Add the current route to visited routes
      markRouteAsVisited(currentRouteKey);
      
      // Only show loading for routes that haven't been visited before
      if (!hasVisitedBefore) {
        // Start the progress bar and show loading overlay
        NProgress.start();
        setIsLoading(true);
        
        // Set a small timeout to ensure the animation is visible even for fast page loads
        const timer = setTimeout(() => {
          NProgress.done();
          setIsLoading(false);
        }, 500);
        
        // Update refs with current values
        prevPathname.current = pathname;
        prevSearchParams.current = searchParams;
        
        return () => {
          clearTimeout(timer);
          NProgress.done();
          setIsLoading(false);
        };
      } else {
        // For already visited routes, just update the refs without showing loading
        prevPathname.current = pathname;
        prevSearchParams.current = searchParams;
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 dark:border-t-blue-400 border-blue-200 dark:border-gray-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 animate-pulse">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
