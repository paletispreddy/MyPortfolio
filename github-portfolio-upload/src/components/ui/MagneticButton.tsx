import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'gold' | 'glass' | 'outline' | 'teal';
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  variant = 'gold',
  strength = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.2 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (clientX - centerX) * strength;
    const distanceY = (clientY - centerY) * strength;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    gold: 'bg-gradient-to-r from-gold via-gold-light to-gold text-[#07080B] font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] border border-gold-light/40',
    glass: 'bg-white/[0.05] hover:bg-white/[0.1] text-text border border-white/10 hover:border-gold/40 shadow-sm backdrop-blur-md',
    outline: 'bg-transparent text-gold hover:text-gold-light border border-gold/40 hover:border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]',
    teal: 'bg-teal/10 hover:bg-teal/20 text-teal border border-teal/40 hover:border-teal shadow-[0_0_15px_rgba(45,226,199,0.2)]',
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className={`relative inline-flex items-center justify-center px-7 py-3.5 rounded-full font-inter text-sm tracking-wide transition-all duration-300 select-none cursor-pointer group ${variantStyles[variant]} ${className}`}
        data-cursor="hover"
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className="inline-block no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-block border-none bg-transparent p-0 m-0 outline-none"
    >
      {content}
    </button>
  );
};
