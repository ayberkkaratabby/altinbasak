'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  end,
  duration = 1.5,
  start = 0,
  className,
  decimals = 0,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const spring = useSpring(start, { stiffness: 50, damping: 30 });

  useEffect(() => {
    spring.set(end);
  }, [end, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [spring]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
}

