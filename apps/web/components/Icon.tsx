'use client';

import React from 'react';

interface IconProps {
  name: 'chevronLeft' | 'chevronRight' | 'x' | 'view';
  size?: number;
  className?: string;
}

const iconPaths = {
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  x: 'M6 18L18 6M6 6l12 12',
  view: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
};

export function Icon({ name, size = 24, className }: IconProps) {
  const path = iconPaths[name];
  if (!path) return null;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {name === 'view' ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <path d={path} />
      )}
    </svg>
  );
}

