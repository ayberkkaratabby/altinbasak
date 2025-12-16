'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{ 
        scaleX,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <motion.div
        className="h-full"
        style={{ 
          scaleX,
          backgroundColor: 'var(--color-primary)',
        }}
      />
    </motion.div>
  );
}

