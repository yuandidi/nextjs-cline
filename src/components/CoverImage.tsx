"use client";

import Image from 'next/image';
import { useState } from 'react';

interface CoverImageProps {
  src?: string;
  alt: string;
  title: string;
}

export default function CoverImage({ src, alt, title }: CoverImageProps) {
  const [imageError, setImageError] = useState(false);
  
  if (!src || imageError) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <h2 className="text-gray-500 dark:text-gray-400 text-2xl text-center px-4">
          {title}
        </h2>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority
      onError={() => setImageError(true)}
    />
  );
}
