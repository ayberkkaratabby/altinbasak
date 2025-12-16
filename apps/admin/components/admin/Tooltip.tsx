'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  onClose?: () => void;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
  onClose,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const isString = typeof content === 'string';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        setIsVisible(false);
        onClose?.();
      }}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl',
            isString ? 'whitespace-nowrap' : 'min-w-[200px] max-w-[320px]',
            positionClasses[position],
            className
          )}
        >
          {content}
          {onClose && (
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="absolute top-1 right-1 text-white/60 hover:text-white"
            >
              ×
            </button>
          )}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 rotate-45',
              position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
              position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
              position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
              position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1',
            )}
          />
        </div>
      )}
    </div>
  );
}

