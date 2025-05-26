"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use useEffect to track mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Toggle dark mode with animation
  const toggleDarkMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setTimeout(() => {
        setIsAnimating(false);
      }, 600); // Animation duration
    }, 150); // Slight delay before theme change
  };

  // Don't render anything until after client-side hydration to avoid mismatch
  if (!mounted) {
    return <div className="w-5 h-5"></div>; // Placeholder with same dimensions
  }
  
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-all duration-500 transform ${
        isAnimating ? 'scale-90' : 'hover:scale-110'
      } ${
        isDarkMode 
          ? 'bg-lavender-900 text-lavender-100 hover:bg-lavender-800' 
          : 'bg-sakura-100 text-sakura-600 hover:bg-sakura-200'
      }`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      disabled={isAnimating}
    >
      <div className={`relative w-5 h-5 transition-transform duration-500 ${isAnimating ? 'animate-flip' : ''}`}>
        {isDarkMode ? (
          // Sun icon for light mode - anime style
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-5 h-5 ${isAnimating ? 'animate-spin-slow' : 'animate-pulse'}`}
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          // Moon icon for dark mode - anime style
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-5 h-5 ${isAnimating ? 'animate-bounce-small' : ''}`}
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
        
        {/* Animated stars/sparkles effect */}
        {isDarkMode && (
          <>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-twinkle opacity-90"></div>
            <div className="absolute bottom-0 -left-1 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle-delay opacity-75"></div>
          </>
        )}
        
        {/* Moon glow effect */}
        {!isDarkMode && (
          <>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-sakura-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-sakura-300 rounded-full animate-pulse-slow opacity-60"></div>
          </>
        )}
      </div>
    </button>
  )}