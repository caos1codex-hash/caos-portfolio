'use client';

import { motion } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionReveal({
  children,
  className = '',
  delay = 0,
}: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
        scale: 0.95,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
      }}
      viewport={{
        once: true,
        margin: '-100px',
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
