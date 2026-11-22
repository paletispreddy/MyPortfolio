import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9000] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-deep via-gold to-teal transition-all duration-75 ease-out shadow-[0_0_12px_rgba(212,175,55,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
