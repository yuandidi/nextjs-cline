"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/blog';

interface SearchBarProps {
  posts?: BlogPost[];
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // 如果没有传入posts，则不进行搜索
    if (!posts || posts.length === 0) {
      setSearchResults([]);
      return;
    }
    
    // 根据搜索词过滤文章
    const results = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(term.toLowerCase());
      const excerptMatch = post.excerpt.toLowerCase().includes(term.toLowerCase());
      const contentMatch = post.content.toLowerCase().includes(term.toLowerCase());
      
      return titleMatch || excerptMatch || contentMatch;
    });
    
    setSearchResults(results);
  };

  const handleResultClick = (slug: string, type?: string) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    
    // 根据文章类型决定跳转路径
    if (type === 'feishu') {
      router.push(`/feishu/${slug}`);
    } else {
      router.push(`/blog/${slug}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-12">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sakura-500 dark:text-sakura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-3 border-2 border-sakura-200 dark:border-sakura-800 rounded-full focus:outline-none focus:ring-2 focus:ring-sakura-500 dark:focus:ring-sakura-400 dark:bg-gray-800 dark:text-white font-quicksand transition-all duration-200 shadow-sm hover:shadow-md"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setIsSearching(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sakura-500 dark:text-sakura-400 hover:text-sakura-700 dark:hover:text-sakura-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-sakura-200 dark:border-sakura-800 max-h-96 overflow-y-auto">
          <ul>
            {searchResults.map((post) => (
              <li key={post.slug} className="border-b border-sakura-100 dark:border-sakura-900 last:border-b-0">
                <button
                  onClick={() => handleResultClick(post.slug, post.type)}
                  className="w-full text-left px-4 py-3 hover:bg-sakura-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium font-quicksand text-gray-900 dark:text-white">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{post.excerpt}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isSearching && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-sakura-200 dark:border-sakura-800 p-4 text-center">
          <p className="text-sakura-600 dark:text-sakura-400 font-quicksand">没有找到与 &quot;{searchTerm}&quot; 相关的结果</p>
        </div>
      )}
    </div>
  );
}
