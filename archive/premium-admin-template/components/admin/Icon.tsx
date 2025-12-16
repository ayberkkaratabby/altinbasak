'use client';

import React from 'react';
import { AdminIcons, IconName } from './icons';
import { cn } from '@/lib/utils';

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 2 }: IconProps) {
  const IconComponent = AdminIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={typeof size === 'number' ? size : parseInt(size)}
      className={cn('flex-shrink-0', className)}
      strokeWidth={strokeWidth}
    />
  );
}

