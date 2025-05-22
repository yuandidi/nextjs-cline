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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-center px-4">
              {post.title}
            </p>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(post.date)}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
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
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}
