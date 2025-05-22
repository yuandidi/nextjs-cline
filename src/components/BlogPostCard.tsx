"use client";

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import TagList from './TagList';

interface BlogPostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    coverImage?: string;
    tags?: string[];
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:anime-glow">
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
        {post.coverImage && !imageError ? (
          <div className="relative h-full w-full">
            <Image
              src={post.coverImage}
              alt={`Cover image for ${post.title}`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sakura-500/30 to-transparent opacity-60"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-sakura-100 to-lavender-100 dark:from-sakura-900 dark:to-lavender-900">
            <p className="text-sakura-600 dark:text-sakura-300 text-center px-4 font-quicksand font-bold">
              {post.title}
            </p>
          </div>
        )}
      </div>
      <div className="p-6 border-t-2 border-sakura-200 dark:border-sakura-800">
        <p className="text-sm text-lavender-600 dark:text-lavender-400 font-quicksand">
          {formatDate(post.date)}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-2 text-xl font-semibold font-quicksand text-gray-900 dark:text-white hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors duration-200">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <TagList tags={post.tags} className="mt-3" />
        )}
        
        <div className="mt-4">
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sakura-600 dark:text-sakura-400 hover:text-sakura-800 dark:hover:text-sakura-300 transition-colors duration-200 font-quicksand"
          >
            阅读更多 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
