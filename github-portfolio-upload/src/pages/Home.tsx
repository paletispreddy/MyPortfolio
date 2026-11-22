import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  ChevronDown,
  Play,
  ExternalLink,
} from 'lucide-react';

import { siteConfig } from '@/config/site';
import { getAllPhotos, getAllVideos, getProfilePhoto, MediaItem, VideoItem } from '@/lib/media';
import { HeroConstellation } from '@/components/3d/HeroConstellation';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SplitText } from '@/components/ui/SplitText';
import { MonogramPlaceholder } from '@/components/ui/MonogramPlaceholder';

gsap.registerPlugin(ScrollTrigger);

// Word-by-word scroll reveal for Philosophy section
const PhilosophyWord: React.FC<{
  word: string;
  index: number;
  total: number;
  progress: any;
}> = ({ word, index, total, progress }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start * 0.9, end * 0.9 + 0.1], [0.15, 1]);
  const color = useTransform(
    progress,
    [start * 0.9, end * 0.9 + 0.1],
    ['#8C8A85', '#F3D98B']
  );

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.3em] last:mr-0 transition-colors duration-200"
    >
      {word}
    </motion.span>
  );
};

export const Home: React.FC = () => {
  const profilePhoto = getProfilePhoto();
  const photos = getAllPhotos().slice(0, 6);
  const videos = getAllVideos().slice(0, 3);

  // Philosophy Scroll tracking
  const quoteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  // Marquee scroll velocity reaction
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Pillars GSAP Horizontal Scroll Pin
  const pillarsSectionRef = useRef<HTMLDivElement>(null);
  const pillarsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable GSAP pin on desktop / tablet where width >= 1024px
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      if (!pillarsSectionRef.current || !pillarsTrackRef.current) return;

      const track = pillarsTrackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth + 140;

      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: pillarsSectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth + 400}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  // Icon mapping for pillars
  const pillarIcons: Record<string, React.FC<{ className?: string }>> = {
    Compass,
    Activity,
    ShieldCheck,
    Cpu,
  };

  const words = siteConfig.philosophy.split(' ');

  return (
    <div className="relative w-full bg-[#07080B] text-text overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-16 overflow-hidden">
        {/* 3D Background */}
        <HeroConstellation />

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow in JetBrains Mono */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-gold/30 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(212,175,55,0.12)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_#2DE2C7]" />
            <span className="font-mono text-[11px] sm:text-xs text-gold tracking-[0.2em] uppercase">
              {siteConfig.eyebrow}
            </span>
          </motion.div>

          {/* Name in Huge Fraunces Gold-Shimmer Text */}
          <div className="mb-6">
            <h1 className="font-fraunces text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-gold-gradient">
              {siteConfig.name}
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-2xl text-text-muted font-light tracking-wide max-w-2xl mb-10"
          >
            {siteConfig.tagline}
          </motion.p>

          {/* Two Magnetic CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-5 mb-16"
          >
            <MagneticButton href="/photos" variant="gold">
              Explore My Work
              <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton href="/about" variant="glass">
              About Me
            </MagneticButton>
          </motion.div>

          {/* Animated Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col items-center gap-2 text-text-muted hover:text-gold transition-colors select-none"
          >
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
              SCROLL TO EXPLORE
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-gold" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTRO STRIP */}
      <section className="relative w-full py-24 px-6 sm:px-12 bg-gradient-to-b from-transparent via-[#0E1016]/80 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Profile Photo with 3D Tilt & Conic Gold Border */}
          <div className="w-full max-w-[320px] sm:max-w-[360px] flex-shrink-0">
            <TiltCard conicBorder maxTilt={10} className="w-full aspect-[4/5] shadow-2xl">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover rounded-[19px] filter contrast-[1.05]"
                  loading="lazy"
                />
              ) : (
                <MonogramPlaceholder size="xl" className="w-full h-full" />
              )}
            </TiltCard>
          </div>

          {/* Intro Text */}
          <div className="flex-1 text-left">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-4">
              EXECUTIVE SUMMARY
            </span>
            <blockquote className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-light text-[#EDEAE3] leading-relaxed mb-8">
              "{siteConfig.shortIntro}"
            </blockquote>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Spearheading strategic execution across modern technology enterprises, bridging business administration with scalable product architectures and enduring customer value.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-mono text-xs tracking-widest uppercase transition-colors group"
                data-cursor="hover"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFINITE MARQUEE */}
      <section className="relative w-full py-16 overflow-hidden border-y border-white/5 bg-[#07080B]/90">
        {/* Row 1: Left */}
        <div className="flex w-max space-x-10 animate-[shimmer_25s_linear_infinite] whitespace-nowrap mb-6">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center space-x-10">
              {siteConfig.marqueeWords.map((word, i) => (
                <div key={i} className="flex items-center space-x-10">
                  <span className="font-fraunces text-2xl sm:text-4xl text-text/80 hover:text-gold transition-colors font-light">
                    {word}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-gold/50 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Row 2: Right (Reverse) */}
        <div className="flex w-max space-x-10 whitespace-nowrap" style={{ transform: 'translateX(-30%)' }}>
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center space-x-10 animate-[shimmer_30s_linear_infinite_reverse]">
              {siteConfig.marqueeWords.slice().reverse().map((word, i) => (
                <div key={i} className="flex items-center space-x-10">
                  <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-text-muted hover:text-teal transition-colors">
                    {word}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal/40" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 4. PILLARS SECTION (Pinned Horizontal Scroll on Desktop) */}
      <section
        ref={pillarsSectionRef}
        className="relative w-full min-h-screen py-24 bg-[#07080B] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-3">
              FOUNDATIONAL TENETS
            </span>
            <h2 className="font-fraunces text-3xl sm:text-5xl font-normal text-gold-gradient">
              Core Pillars of Growth
            </h2>
          </div>
          <p className="text-text-muted font-mono text-xs max-w-sm tracking-wide">
            The four strategic drivers steering every enterprise initiative from inception to market authority.
          </p>
        </div>

        {/* Track Container */}
        <div className="w-full px-6 sm:px-12">
          <div
            ref={pillarsTrackRef}
            className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:w-max overflow-x-visible pb-12"
          >
            {siteConfig.pillars.map((pillar) => {
              const IconComp = pillarIcons[pillar.iconName] || Cpu;
              return (
                <div
                  key={pillar.id}
                  className="w-full lg:w-[460px] h-auto lg:h-[480px] p-8 sm:p-10 rounded-[20px] bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-gold/40 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between group shadow-xl"
                  data-cursor="hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-5xl sm:text-6xl font-light text-white/[0.08] group-hover:text-gold/25 transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-fraunces text-3xl sm:text-4xl font-normal text-[#EDEAE3] mb-4 group-hover:text-gold-light transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-text-muted text-base leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between font-mono text-xs text-text-muted group-hover:text-teal transition-colors">
                    <span>STRATEGIC FOUNDATION</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PHOTOS PREVIEW */}
      <section className="relative w-full py-28 px-6 sm:px-12 bg-gradient-to-b from-transparent via-[#0E1016]/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-3">
                VISUAL ARCHIVE
              </span>
              <h2 className="font-fraunces text-3xl sm:text-5xl font-normal text-[#EDEAE3]">
                Moments & Milestones
              </h2>
            </div>
            <Link
              to="/photos"
              className="inline-flex items-center gap-2 font-mono text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors group"
              data-cursor="hover"
            >
              <span>View all photos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo, i) => (
              <Link
                key={photo.id}
                to="/photos"
                className={`group relative rounded-[20px] overflow-hidden bg-white/[0.02] border border-white/10 hover:border-gold/50 transition-all duration-500 shadow-lg ${
                  i === 0 ? 'md:col-span-2 lg:col-span-2 aspect-[16/10]' : 'aspect-square'
                }`}
                data-cursor="view"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[11px] text-teal tracking-widest uppercase block mb-1">
                      {photo.category}
                    </span>
                    <h4 className="font-fraunces text-xl sm:text-2xl text-[#EDEAE3] group-hover:text-gold-light transition-colors">
                      {photo.title}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-[#07080B] transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED VIDEOS PREVIEW */}
      <section className="relative w-full py-28 px-6 sm:px-12 bg-[#07080B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-3">
                CINEMATIC PERSPECTIVE
              </span>
              <h2 className="font-fraunces text-3xl sm:text-5xl font-normal text-[#EDEAE3]">
                In Motion
              </h2>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-2 font-mono text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors group"
              data-cursor="hover"
            >
              <span>View all videos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3 Featured Video Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.length > 0 ? (
              videos.map((vid) => (
                <Link
                  key={vid.id}
                  to="/videos"
                  className="group relative rounded-[20px] overflow-hidden bg-white/[0.03] border border-white/10 hover:border-teal/50 transition-all duration-500 flex flex-col shadow-xl"
                  data-cursor="play"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0E1016]">
                    {vid.poster ? (
                      <img
                        src={vid.poster}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('maxresdefault.jpg')) {
                            target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#12141C] to-[#07080B]">
                        <span className="font-mono text-xs text-text-muted">PREVIEW READY</span>
                      </div>
                    )}

                    {/* Pulsing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#07080B]/80 backdrop-blur-md border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_25px_rgba(212,175,55,0.4)] group-hover:scale-110 group-hover:bg-gold group-hover:text-[#07080B] transition-all">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-teal tracking-widest uppercase block mb-2">
                        {vid.category}
                      </span>
                      <h4 className="font-fraunces text-xl font-normal text-[#EDEAE3] group-hover:text-gold-light transition-colors line-clamp-2">
                        {vid.title}
                      </h4>
                    </div>
                    {vid.description && (
                      <p className="mt-3 text-xs text-text-muted line-clamp-2 font-light">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 rounded-[20px] bg-white/[0.02] border border-white/10 text-center">
                <p className="font-mono text-sm text-text-muted">
                  No video files added yet. Drop .mp4 files into <code className="text-gold">src/media/videos/</code> or add links in <code className="text-gold">links.json</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. PHILOSOPHY SECTION (Word by Word Scroll Reveal) */}
      <section
        ref={quoteRef}
        className="relative w-full py-36 px-6 sm:px-12 bg-gradient-to-b from-[#07080B] via-[#0E1016] to-[#07080B] border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="font-mono text-xs text-teal tracking-[0.3em] uppercase block mb-8">
            GUIDING CREED
          </span>

          <div className="font-fraunces text-3xl sm:text-5xl lg:text-6xl font-light leading-[1.3] tracking-tight">
            "{words.map((word, i) => (
              <PhilosophyWord
                key={i}
                word={word}
                index={i}
                total={words.length}
                progress={quoteProgress}
              />
            ))}"
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="font-mono text-xs text-gold tracking-widest uppercase">
              {siteConfig.name}
            </span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>
      </section>
    </div>
  );
};
