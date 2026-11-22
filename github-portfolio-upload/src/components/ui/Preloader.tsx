import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('aurum_nexus_preloaded');
    } catch {
      return false;
    }
  });

  const [counter, setCounter] = useState<number>(0);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    if (!shouldShow) {
      if (onComplete) onComplete();
      return;
    }

    // Run counter 0 to 100
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(eased * 100);
      setCounter(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCounter(100);
        setTimeout(() => {
          setIsSplitting(true);
          try {
            sessionStorage.setItem('aurum_nexus_preloaded', 'true');
          } catch (e) {
            console.warn('sessionStorage is unavailable:', e);
          }
          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, 800);
        }, 300);
      }
    };

    // Safety auto-dismiss timer in case of browser throttling
    const safetyTimeout = setTimeout(() => {
      setIsSplitting(true);
      setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 500);
    }, 2800);

    const animId = requestAnimationFrame(updateCounter);
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimeout);
    };
  }, [shouldShow, onComplete]);

  if (!shouldShow || isDone) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none select-none flex flex-col items-center justify-center overflow-hidden">
      {/* Top half split curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isSplitting ? '-100%' : '0%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#07080B] border-b border-gold/40 shadow-[0_4px_30px_rgba(212,175,55,0.2)] pointer-events-auto z-10"
      />

      {/* Bottom half split curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isSplitting ? '100%' : '0%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#07080B] border-t border-gold/40 shadow-[0_-4px_30px_rgba(212,175,55,0.2)] pointer-events-auto z-10"
      />

      {/* Central Content (Monogram & Counter) */}
      <AnimatePresence>
        {!isSplitting && (
          <motion.div
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Animated SVG drawing "SP" Monogram */}
            <div className="relative w-36 h-36 mb-6">
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="preloaderGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F3D98B" />
                    <stop offset="50%" stop-color="#D4AF37" />
                    <stop offset="100%" stop-color="#9C7A1E" />
                  </linearGradient>
                </defs>

                {/* Outer decorative octagonal border */}
                <motion.rect
                  x="10"
                  y="10"
                  width="100"
                  height="100"
                  rx="24"
                  stroke="url(#preloaderGold)"
                  strokeWidth="1.5"
                  strokeDasharray="400"
                  initial={{ strokeDashoffset: 400 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />

                {/* "S" Monogram Stroke */}
                <motion.path
                  d="M48 42 C38 42 32 46 32 54 C32 62 40 64 46 67 C54 70 60 72 60 80 C60 88 52 92 42 92 C33 92 27 86 26 78"
                  stroke="url(#preloaderGold)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
                />

                {/* "P" Monogram Stroke */}
                <motion.path
                  d="M68 92 V42 H84 C94 42 100 48 100 58 C100 68 94 74 84 74 H68"
                  stroke="url(#preloaderGold)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
                />

                {/* Center glowing teal spark */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="2.5"
                  fill="#2DE2C7"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.2, delay: 0.8, repeat: Infinity }}
                />
              </svg>
            </div>

            {/* Counter 00 - 100 in JetBrains Mono */}
            <div className="flex items-baseline space-x-2 font-mono">
              <span className="text-3xl font-medium tracking-tighter text-gold-gradient">
                {String(counter).padStart(2, '0')}
              </span>
              <span className="text-xs text-text-muted uppercase tracking-widest">
                / 100
              </span>
            </div>

            <p className="mt-2 text-[10px] font-mono tracking-[0.3em] text-[#8C8A85] uppercase">
              AURUM NEXUS · INITIALIZING
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
