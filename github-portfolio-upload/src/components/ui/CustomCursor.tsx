import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'view' | 'play'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Exact mouse positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lagging ring positions
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check for touch device or coarse pointer
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const closestView = target.closest('[data-cursor="view"], .cursor-view');
      const closestPlay = target.closest('[data-cursor="play"], .cursor-play');
      const closestInteractive = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]');

      if (closestPlay) {
        setCursorMode('play');
      } else if (closestView) {
        setCursorMode('view');
      } else if (closestInteractive) {
        setCursorMode('hover');
      } else {
        setCursorMode('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  // Ring dimensions and styles based on mode
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(212, 175, 55, 0.04)',
      borderColor: 'rgba(212, 175, 55, 0.45)',
      borderWidth: 1.5,
    },
    hover: {
      width: 54,
      height: 54,
      backgroundColor: 'rgba(212, 175, 55, 0.12)',
      borderColor: 'rgba(243, 217, 139, 0.8)',
      borderWidth: 1.5,
    },
    view: {
      width: 76,
      height: 76,
      backgroundColor: 'rgba(212, 175, 55, 0.92)',
      borderColor: '#F3D98B',
      borderWidth: 2,
    },
    play: {
      width: 76,
      height: 76,
      backgroundColor: 'rgba(45, 226, 199, 0.92)',
      borderColor: '#2DE2C7',
      borderWidth: 2,
    },
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Lagging Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center shadow-lg"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={ringVariants}
        animate={cursorMode}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {cursorMode === 'view' && (
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#07080B] select-none">
            VIEW
          </span>
        )}
        {cursorMode === 'play' && (
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#07080B] select-none">
            PLAY
          </span>
        )}
      </motion.div>

      {/* Center Pinpoint Gold Dot */}
      {cursorMode !== 'view' && cursorMode !== 'play' && (
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: cursorMode === 'hover' ? 0.5 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      )}
    </div>
  );
};
