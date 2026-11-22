import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  Layers,
  Settings,
  Users,
  Workflow,
  HeartHandshake,
  Globe,
  Mail,
  Linkedin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { siteConfig, BusinessInterest } from '@/config/site';
import { getProfilePhoto } from '@/lib/media';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { MonogramPlaceholder } from '@/components/ui/MonogramPlaceholder';
import { IcosahedronNode } from '@/components/3d/IcosahedronNode';

// Spotlight Bento Card for Core Business Interests
const BentoCard: React.FC<{ item: BusinessInterest; index: number }> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    TrendingUp,
    Sparkles,
    Layers,
    Settings,
    Users,
    Workflow,
    HeartHandshake,
    Globe,
  };
  const IconComp = iconMap[item.iconName] || Sparkles;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -200, y: -200 });
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative rounded-[20px] p-7 bg-[#0E1016]/90 border border-white/10 hover:border-gold/40 transition-all duration-400 overflow-hidden group flex flex-col justify-between shadow-xl"
      data-cursor="hover"
    >
      {/* Dynamic Gold Spotlight following cursor inside card */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[20px] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.15), transparent 70%)`,
        }}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between mb-8">
        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <IconComp className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs text-text-muted group-hover:text-teal transition-colors">
          0{item.id}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-fraunces text-2xl font-normal text-[#EDEAE3] mb-2 group-hover:text-gold-light transition-colors">
          {item.title}
        </h3>
        <p className="text-text-muted text-sm font-light leading-relaxed mb-6">
          {item.subtitle}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
          {item.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 font-mono text-[10px] text-text-muted group-hover:border-gold/20 group-hover:text-text transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const About: React.FC = () => {
  const profilePhoto = getProfilePhoto();

  // Parallax on hero portrait
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const portraitY = useTransform(heroScroll, [0, 1], ['0%', '15%']);

  // Timeline scroll line drawing
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start 0.8', 'end 0.4'],
  });
  const lineHeight = useTransform(timelineScroll, [0, 1], ['0%', '100%']);

  return (
    <div className="relative w-full min-h-screen bg-[#07080B] text-text pt-32 pb-24 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/6 left-1/4 w-[600px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* 1. HERO SECTION */}
        <section ref={heroRef} className="relative w-full mb-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Portrait with Parallax & Gold Frame */}
            <motion.div
              style={{ y: portraitY }}
              className="w-full max-w-[360px] sm:max-w-[420px] flex-shrink-0"
            >
              <TiltCard conicBorder maxTilt={8} className="w-full aspect-[4/5] shadow-2xl">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={siteConfig.name}
                    className="w-full h-full object-cover rounded-[19px] filter contrast-[1.05]"
                  />
                ) : (
                  <MonogramPlaceholder size="xl" className="w-full h-full" />
                )}
              </TiltCard>
            </motion.div>

            {/* Name & Title */}
            <div className="flex-1 text-left">
              <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-4">
                BIOGRAPHY & PROFILE
              </span>

              <h1 className="font-fraunces text-4xl sm:text-6xl lg:text-7xl font-normal text-gold-gradient tracking-tight leading-[1.1] mb-6">
                {siteConfig.name}
              </h1>

              <div className="inline-block px-4 py-2 rounded-xl bg-white/[0.04] border border-gold/30 backdrop-blur-md mb-8">
                <p className="font-mono text-sm sm:text-base text-gold-light tracking-wide">
                  {siteConfig.tagline}
                </p>
              </div>

              <div className="space-y-6 text-text-muted text-base sm:text-lg font-light leading-relaxed max-w-2xl">
                {/* Paragraph 1 */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {siteConfig.storyParagraphs[0]}
                </motion.p>
                {/* Paragraph 2 */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {siteConfig.storyParagraphs[1]}
                </motion.p>
                {/* Paragraph 3 */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {siteConfig.storyParagraphs[2]}
                </motion.p>
                {/* Paragraph 4 */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {siteConfig.storyParagraphs[3]}
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CORE BUSINESS INTERESTS (Bento Grid of 8 Glass Cards) */}
        <section className="relative w-full py-20 border-t border-white/5">
          <div className="mb-14">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-3">
              DOMAIN EXPERTISE
            </span>
            <h2 className="font-fraunces text-3xl sm:text-5xl font-normal text-gold-gradient tracking-tight">
              Core Business Interests
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.coreInterests.map((interest, idx) => (
              <BentoCard key={interest.id} item={interest} index={idx} />
            ))}
          </div>
        </section>

        {/* 3. HOW I WORK (Timeline with Gold Line & 3D Interactive Icosahedron) */}
        <section ref={timelineRef} className="relative w-full py-24 border-t border-white/5">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
            <div>
              <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-3">
                EXECUTION PHILOSOPHY
              </span>
              <h2 className="font-fraunces text-3xl sm:text-5xl font-normal text-[#EDEAE3] tracking-tight">
                How I Work
              </h2>
            </div>

            {/* Interactive 3D Gold Wireframe Icosahedron */}
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-[20px] p-4 pr-8">
              <IcosahedronNode />
              <div>
                <span className="font-mono text-xs text-gold tracking-widest uppercase block mb-1">
                  INTERACTIVE NODE
                </span>
                <p className="text-xs text-text-muted max-w-[200px]">
                  Hover and rotate to inspect the polyhedral geometric nexus.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Cards with animated vertical gold line */}
          <div className="relative pl-8 sm:pl-12">
            {/* Background Line Track */}
            <div className="absolute top-0 bottom-0 left-[11px] sm:left-[19px] w-[2px] bg-white/10" />
            {/* Animated Gold Fill Line */}
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-[11px] sm:left-[19px] w-[2px] bg-gradient-to-b from-gold via-gold-light to-teal shadow-[0_0_12px_rgba(212,175,55,0.8)] origin-top"
            />

            <div className="space-y-10">
              {siteConfig.workingPrinciples.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative flex items-start gap-6 group"
                >
                  {/* Timeline Node Point */}
                  <div className="absolute -left-[28px] sm:-left-[36px] top-1.5 w-4 h-4 rounded-full bg-[#07080B] border-2 border-gold shadow-[0_0_10px_rgba(212,175,55,0.6)] group-hover:scale-125 group-hover:bg-teal transition-all" />

                  {/* Card */}
                  <div className="flex-1 p-6 sm:p-8 rounded-[20px] bg-[#0E1016]/80 border border-white/10 hover:border-gold/40 backdrop-blur-md transition-all shadow-md group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                    <h3 className="font-fraunces text-2xl font-normal text-[#EDEAE3] group-hover:text-gold-light transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-base font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MY PHILOSOPHY (Centered Quote Card with Animated Gold Border) */}
        <section className="relative w-full py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <TiltCard conicBorder maxTilt={6} className="w-full shadow-2xl">
              <div className="p-8 sm:p-14 text-center bg-[#0E1016] rounded-[19px]">
                <span className="font-mono text-xs text-teal tracking-[0.3em] uppercase block mb-6">
                  MY PHILOSOPHY
                </span>
                <blockquote className="font-fraunces text-2xl sm:text-4xl font-light leading-snug text-gold-gradient mb-8">
                  "{siteConfig.philosophy}"
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-8 h-[1px] bg-gold/40" />
                  <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
                    {siteConfig.name}
                  </span>
                  <span className="w-8 h-[1px] bg-gold/40" />
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* 5. CALL TO ACTION (Let's Connect) */}
        <section className="relative w-full py-20 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-4">
              DIRECT ENGAGEMENT
            </span>
            <h2 className="font-fraunces text-4xl sm:text-6xl font-normal text-[#EDEAE3] mb-6">
              Let's Connect
            </h2>
            <p className="text-text-muted text-base sm:text-lg font-light leading-relaxed mb-10">
              Whether you are architecting a new venture, seeking strategic guidance, or exploring collaboration opportunities, reach out directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <MagneticButton
                href={`mailto:${siteConfig.email}`}
                variant="gold"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Directly
              </MagneticButton>
              <MagneticButton
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variant="glass"
              >
                <Linkedin className="w-4 h-4 mr-2 text-teal" />
                Connect on LinkedIn
              </MagneticButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
