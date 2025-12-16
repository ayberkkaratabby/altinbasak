'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'empty',
  title = 'Veri bulunamadı',
  description,
  action,
  actionLabel,
  actionHref,
  actionOnClick,
  className,
}: EmptyStateProps) {
  const defaultAction = actionLabel && (
    actionHref ? (
      <Link href={actionHref}>
        <Button variant="primary" onClick={actionOnClick}>
          {actionLabel}
        </Button>
      </Link>
    ) : (
      <Button variant="primary" onClick={actionOnClick}>
        {actionLabel}
      </Button>
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4',
        className
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-xl opacity-50" />
          <div className="relative">
            <Icon name={icon as any} size={80} className="text-gray-300" />
          </div>
        </motion.div>
      )}
      
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-gray-900 mb-3 text-center"
        >
          {title}
        </motion.h3>
      )}
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-center max-w-md mb-8 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      
      {(action || defaultAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action || defaultAction}
        </motion.div>
      )}
    </motion.div>
  );
}

