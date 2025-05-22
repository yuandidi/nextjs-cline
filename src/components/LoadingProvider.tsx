"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

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
  
  // Use refs to track previous values for comparison
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams);
  
  useEffect(() => {
    // Only trigger loading animation when the path or search params actually change
    if (prevPathname.current !== pathname || prevSearchParams.current !== searchParams) {
      // Start the progress bar
      NProgress.start();
      
      // Set a small timeout to ensure the animation is visible even for fast page loads
      const timer = setTimeout(() => {
        NProgress.done();
      }, 500);
      
      // Update refs with current values
      prevPathname.current = pathname;
      prevSearchParams.current = searchParams;
      
      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    }
  }, [pathname, searchParams]);

  return null;
}
