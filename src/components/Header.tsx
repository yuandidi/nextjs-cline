"use client";

import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' 
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold anime-gradient-text font-quicksand">
              二次元博客
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link 
                href="/" 
                className="font-quicksand text-sakura-600 dark:text-sakura-400 hover:text-sakura-800 dark:hover:text-sakura-300 transition-colors duration-200"
              >
                首页
              </Link>
              <Link 
                href="/tags" 
                className="font-quicksand text-lavender-600 dark:text-lavender-400 hover:text-lavender-800 dark:hover:text-lavender-300 transition-colors duration-200"
              >
                标签
              </Link>
              <Link 
                href="/about" 
                className="font-quicksand text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors duration-200"
              >
                关于
              </Link>
              {session?.user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="font-quicksand text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  管理
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
