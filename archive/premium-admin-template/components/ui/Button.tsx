'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text' | 'accent';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-black/90 focus:ring-2 focus:ring-black focus:ring-offset-2',
  secondary: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white focus:ring-2 focus:ring-black focus:ring-offset-2',
  ghost: 'bg-transparent text-black hover:bg-black/5 focus:ring-2 focus:ring-black focus:ring-offset-2',
  text: 'bg-transparent text-black hover:text-black/70 focus:ring-2 focus:ring-black focus:ring-offset-2',
  accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2',
};

const buttonSizes = {
  sm: 'px-5 py-2.5 text-sm font-medium',
  md: 'px-8 py-3.5 text-base font-semibold',
  lg: 'px-10 py-4 text-lg font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center transition-all duration-200',
    'focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'relative overflow-hidden',
    'rounded-sm',
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClasses, children.props.className),
      ...props,
    } as any);
  }

  const { onDrag, onDragEnd, onDragStart, ...buttonProps } = props;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : {}}
      transition={{ 
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={baseClasses}
      disabled={disabled}
      {...(buttonProps as any)}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

