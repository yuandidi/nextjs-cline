"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/blog';

interface SearchBarProps {
  posts: BlogPost[];
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
    
    // Filter posts based on search term
    const results = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(term.toLowerCase());
      const excerptMatch = post.excerpt.toLowerCase().includes(term.toLowerCase());
      const contentMatch = post.content.toLowerCase().includes(term.toLowerCase());
      
      return titleMatch || excerptMatch || contentMatch;
    });
    
    setSearchResults(results);
  };

  const handleResultClick = (slug: string) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setIsSearching(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <ul>
            {searchResults.map((post) => (
              <li key={post.slug} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <button
                  onClick={() => handleResultClick(post.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{post.excerpt}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isSearching && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">No results found for &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
