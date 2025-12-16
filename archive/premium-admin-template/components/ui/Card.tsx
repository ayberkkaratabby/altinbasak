import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  asChild?: boolean;
  variant?: 'default' | 'premium' | 'elevated';
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  onClick, 
  asChild,
  variant = 'default'
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    premium: 'bg-white border-0 shadow-lg',
    elevated: 'bg-white border-0 shadow-xl',
  };

  const baseClasses = cn(
    'rounded-xl',
    variantClasses[variant],
    hover && 'cursor-pointer transition-all duration-300',
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClasses, children.props.className),
    } as any);
  }

  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: onClick ? { scale: 0.98 } : undefined,
  } : {};

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-xl font-bold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-gray-600 mt-2 font-light', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}

