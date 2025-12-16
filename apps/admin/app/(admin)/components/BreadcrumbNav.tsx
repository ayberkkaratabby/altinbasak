'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/admin/Icon';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        'flex items-center gap-2 text-sm mb-6',
        className
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {isFirst && (
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Icon name="dashboard" size={16} />
              </Link>
            )}
            
            {!isFirst && (
              <Icon
                name="chevronDown"
                size={16}
                className="text-gray-400 rotate-[-90deg]"
              />
            )}

            {isLast ? (
              <span className="text-gray-900 font-semibold truncate max-w-[200px]">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

