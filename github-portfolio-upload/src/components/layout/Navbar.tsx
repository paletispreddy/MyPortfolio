import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop & Tablet Floating Glass Pill Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-6 left-0 right-0 z-[7000] flex justify-center px-4 pointer-events-none"
      >
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0E1016]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
        >
          {/* Monogram / Brand mark */}
          <NavLink
            to="/"
            className="flex items-center gap-2 pl-2 pr-3 py-1 group select-none no-underline"
            data-cursor="hover"
          >
            <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-gold-deep via-gold to-teal flex items-center justify-center text-[#07080B] font-fraunces font-bold text-xs shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
              SP
            </span>
            <span className="hidden md:inline font-fraunces text-xs font-semibold tracking-wider text-text group-hover:text-gold-light transition-colors">
              PALETI
            </span>
          </NavLink>

          <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Desktop Nav Items */}
          <div className="hidden sm:flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-1.5 rounded-full font-mono text-xs tracking-widest transition-colors duration-200 select-none no-underline ${
                    isActive
                      ? 'text-[#07080B] font-semibold'
                      : 'text-text-muted hover:text-text'
                  }`}
                  data-cursor="hover"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Menu Trigger Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            className="sm:hidden flex flex-col items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gold hover:text-white transition-colors"
            data-cursor="hover"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-4 h-[1.5px] bg-current rounded-full mb-1 origin-center transition-all"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-4 h-[1.5px] bg-current rounded-full mb-1 transition-all"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-4 h-[1.5px] bg-current rounded-full origin-center transition-all"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Full-Screen Overlay Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[6900] bg-[#07080B]/95 backdrop-blur-2xl flex flex-col justify-between p-8 sm:hidden"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs text-gold tracking-widest uppercase">
                AURUM NEXUS · MENU
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-gold"
              >
                ✕
              </button>
            </div>

            {/* Staggered Navigation Links */}
            <div className="flex flex-col gap-6 my-auto">
              {siteConfig.nav.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.4 }}
                  >
                    <NavLink
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block font-fraunces text-4xl font-normal tracking-tight transition-all no-underline ${
                        isActive
                          ? 'text-gold-gradient translate-x-2'
                          : 'text-[#EDEAE3] hover:text-gold'
                      }`}
                    >
                      <span className="text-xs font-mono text-teal mr-3 align-middle">
                        0{index + 1}
                      </span>
                      {item.name}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-white/10">
              <p className="font-mono text-[11px] text-text-muted mb-2 tracking-wide">
                {siteConfig.tagline}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-xs text-teal underline"
              >
                {siteConfig.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
