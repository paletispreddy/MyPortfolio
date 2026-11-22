import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Preloader } from '@/components/ui/Preloader';
import { PageTransition } from '@/components/ui/PageTransition';

gsap.registerPlugin(ScrollTrigger);

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Aurum Nexus caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-[#07080B] text-[#EDEAE3] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-[20px] bg-[#0E1016] border border-gold/30 shadow-2xl">
            <h2 className="font-fraunces text-2xl text-gold-gradient mb-3">Application Notice</h2>
            <p className="text-text-muted text-sm mb-6 font-light">
              {this.state.error?.message || 'An error occurred during page rendering.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-gold text-[#07080B] font-mono text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity"
            >
              RELOAD SITE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded pages for code splitting & high performance
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const Photos = lazy(() => import('@/pages/Photos').then((m) => ({ default: m.Photos })));
const Videos = lazy(() => import('@/pages/Videos').then((m) => ({ default: m.Videos })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Animated route views
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Home />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/photos"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Photos />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/videos"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Videos />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <About />
              </Suspense>
            </PageTransition>
          }
        />
        {/* Catch-all redirect to Home */}
        <Route
          path="*"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Home />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const PageFallback: React.FC = () => (
  <div className="w-full min-h-screen bg-[#07080B] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
      <span className="font-mono text-xs text-gold tracking-widest uppercase">
        LOADING NEXUS...
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Film Grain Texture Overlay */}
        <div className="film-grain" aria-hidden="true" />

        {/* Top Gold Scroll Progress Bar */}
        <ScrollProgress />

        {/* Luxury Custom Cursor (Disabled on Touch) */}
        <CustomCursor />

        {/* Initial Monogram Preloader */}
        <Preloader />

        {/* Main App Layout */}
        <div className="relative min-h-screen flex flex-col bg-[#07080B] text-text">
          <Navbar />
          <ScrollToTop />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
