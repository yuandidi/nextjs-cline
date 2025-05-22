"use client";

import Link from 'next/link';

interface TagListProps {
  tags: string[];
  className?: string;
}

export default function TagList({ tags, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Function to get a color based on the tag name
  const getTagColor = (tag: string) => {
    // Simple hash function to determine color
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['sakura', 'lavender', 'sky', 'matcha'];
    return colors[hash % colors.length];
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const color = getTagColor(tag);
        let bgClass = '';
        let textClass = '';
        let hoverBgClass = '';
        let hoverTextClass = '';
        
        switch(color) {
          case 'sakura':
            bgClass = 'bg-sakura-100 dark:bg-sakura-900';
            textClass = 'text-sakura-800 dark:text-sakura-200';
            hoverBgClass = 'hover:bg-sakura-200 dark:hover:bg-sakura-800';
            hoverTextClass = 'hover:text-sakura-900 dark:hover:text-sakura-100';
            break;
          case 'lavender':
            bgClass = 'bg-lavender-100 dark:bg-lavender-900';
            textClass = 'text-lavender-800 dark:text-lavender-200';
            hoverBgClass = 'hover:bg-lavender-200 dark:hover:bg-lavender-800';
            hoverTextClass = 'hover:text-lavender-900 dark:hover:text-lavender-100';
            break;
          case 'sky':
            bgClass = 'bg-sky-100 dark:bg-sky-900';
            textClass = 'text-sky-800 dark:text-sky-200';
            hoverBgClass = 'hover:bg-sky-200 dark:hover:bg-sky-800';
            hoverTextClass = 'hover:text-sky-900 dark:hover:text-sky-100';
            break;
          case 'matcha':
            bgClass = 'bg-matcha-100 dark:bg-matcha-900';
            textClass = 'text-matcha-800 dark:text-matcha-200';
            hoverBgClass = 'hover:bg-matcha-200 dark:hover:bg-matcha-800';
            hoverTextClass = 'hover:text-matcha-900 dark:hover:text-matcha-100';
            break;
        }
        
        return (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className={`inline-block px-3 py-1 text-xs font-medium font-quicksand rounded-full transition-all duration-200 transform hover:scale-105 ${bgClass} ${textClass} ${hoverBgClass} ${hoverTextClass}`}
          >
            #{tag}
          </Link>
        );
      })}
    </div>
  );
}
