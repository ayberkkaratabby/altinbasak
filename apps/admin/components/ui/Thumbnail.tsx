'use client';

import React from 'react';
import Image from 'next/image';
import { Icon } from '@/components/admin/Icon';
import { cn } from '@/lib/utils';

interface ThumbnailProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackIcon?: string;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export function Thumbnail({
  src,
  alt = '',
  size = 'md',
  fallbackIcon = 'pages',
  className,
  onClick,
}: ThumbnailProps) {
  const hasImage = src && src.length > 0;

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {hasImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size === 'sm' ? '48px' : size === 'md' ? '64px' : '96px'}`}
        />
      ) : (
        <Icon
          name={fallbackIcon as any}
          size={size === 'sm' ? 20 : size === 'md' ? 24 : 32}
          className="text-gray-400"
        />
      )}
    </div>
  );
}

