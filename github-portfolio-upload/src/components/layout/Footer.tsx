import React from 'react';
import { siteConfig } from '@/config/site';
import {
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Github,
  MessageCircle,
  ArrowUp,
  Mail,
} from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { name: 'LinkedIn', icon: Linkedin, url: siteConfig.socials.linkedin },
    { name: 'X / Twitter', icon: Twitter, url: siteConfig.socials.x },
    { name: 'Instagram', icon: Instagram, url: siteConfig.socials.instagram },
    { name: 'YouTube', icon: Youtube, url: siteConfig.socials.youtube },
    { name: 'GitHub', icon: Github, url: siteConfig.socials.github },
    { name: 'WhatsApp', icon: MessageCircle, url: siteConfig.socials.whatsapp },
  ];

  return (
    <footer className="relative w-full bg-[#07080B] border-t border-white/10 pt-24 pb-12 overflow-hidden z-20">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial from-gold/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-16 border-b border-white/10">
          {/* Main Headline */}
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase block mb-4">
              COLLABORATION & VENTURES
            </span>
            <h2 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-gold-gradient mb-6">
              Let's build something that lasts.
            </h2>
            <p className="text-text-muted text-base sm:text-lg max-w-lg font-light leading-relaxed mb-8">
              Open to transformative board roles, strategic partnerships, product incubation, and bold technology initiatives.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton
                href={`mailto:${siteConfig.email}`}
                variant="gold"
                className="text-sm font-medium"
              >
                <Mail className="w-4 h-4 mr-2" />
                Initiate Conversation
              </MagneticButton>
              <MagneticButton
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variant="glass"
                className="text-sm"
              >
                Connect on LinkedIn
              </MagneticButton>
            </div>
          </div>

          {/* Social Links List */}
          <div className="flex flex-col items-start lg:items-end gap-6">
            <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
              DIRECT CHANNELS
            </span>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all duration-300 shadow-sm"
                    data-cursor="hover"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-text-muted hover:text-gold transition-colors"
              data-cursor="hover"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-gold" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8C8A85]">
          <div>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>AURUM NEXUS ARCHITECTURE</span>
            <span className="w-1 h-1 rounded-full bg-teal" />
            <span>ZERO DATABASE / STATIC EDGE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
