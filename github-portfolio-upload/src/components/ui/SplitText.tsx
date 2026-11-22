import React from 'react';
import { motion } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
  as: Component = 'h1',
}) => {
  const words = children.split(' ');

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top leading-none mr-[0.28em] last:mr-0"
        >
          <motion.span
            className={`inline-block will-change-transform ${wordClassName}`}
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.8,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
};
