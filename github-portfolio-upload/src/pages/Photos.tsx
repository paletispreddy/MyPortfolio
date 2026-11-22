import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';

import { getAllPhotos, MediaItem } from '@/lib/media';
import { TiltCard } from '@/components/ui/TiltCard';
import { Image, FolderPlus, Sparkles } from 'lucide-react';

export const Photos: React.FC = () => {
  const allPhotos = useMemo(() => getAllPhotos(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPhotos.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [allPhotos]);

  // Filter photos
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return allPhotos;
    return allPhotos.filter((p) => p.category === selectedCategory);
  }, [allPhotos, selectedCategory]);

  // Prepare slides for Lightbox
  const slides = useMemo(() => {
    return filteredPhotos.map((photo) => ({
      src: photo.src,
      title: photo.title,
      description: `${photo.category}${photo.date ? ` · ${photo.date}` : ''}${
        photo.description ? ` — ${photo.description}` : ''
      }`,
    }));
  }, [filteredPhotos]);

  return (
    <div className="relative w-full min-h-screen bg-[#07080B] text-text pt-32 pb-24 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Page Hero */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase">
              GALLERY & EXHIBITS
            </span>
            <span className="w-1 h-1 rounded-full bg-teal" />
            <span className="font-mono text-xs text-text-muted">
              {allPhotos.length} ARTIFACTS · {categories.length - 1} CATEGORIES
            </span>
          </div>

          <h1 className="font-fraunces text-4xl sm:text-6xl lg:text-7xl font-normal text-gold-gradient tracking-tight mb-6">
            Moments & Milestones
          </h1>

          <p className="text-text-muted text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            A curated visual archive capturing strategic conferences, venture milestones, enterprise product architecture sessions, and leadership gatherings.
          </p>
        </div>

        {/* Category Filter Chips with Framer Motion layout animations */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-5 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 select-none ${
                    isActive
                      ? 'text-[#07080B] font-semibold'
                      : 'text-text-muted hover:text-text bg-white/[0.03] hover:bg-white/[0.08] border border-white/10'
                  }`}
                  data-cursor="hover"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryChip"
                      className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Photos Grid or Empty State */}
        {filteredPhotos.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="w-full"
                >
                  <div
                    onClick={() => setLightboxIndex(i)}
                    className="group cursor-pointer w-full"
                    data-cursor="view"
                  >
                    <TiltCard maxTilt={8} className="w-full aspect-[4/5] bg-[#0E1016] overflow-hidden">
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Image with smooth zoom on hover */}
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-108"
                          loading="lazy"
                        />

                        {/* Top Accent Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 rounded-full bg-[#07080B]/70 backdrop-blur-md border border-white/10 font-mono text-[10px] text-teal tracking-widest uppercase">
                            {photo.category}
                          </span>
                        </div>

                        {/* Slide-Up Bottom Caption */}
                        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#07080B] via-[#07080B]/80 to-transparent translate-y-3 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="font-fraunces text-lg text-[#EDEAE3] group-hover:text-gold-light transition-colors line-clamp-1 mb-1">
                            {photo.title}
                          </h3>
                          {photo.date && (
                            <span className="font-mono text-[11px] text-[#8C8A85] block">
                              {photo.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Elegant Empty State */
          <div className="w-full py-24 px-8 rounded-[20px] bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="font-fraunces text-2xl sm:text-3xl font-normal text-[#EDEAE3] mb-3">
              Drop Photos to Auto-Populate
            </h3>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
              The Aurum Nexus media engine automatically scans subfolders in build time with zero code or JSON edits.
            </p>
            <div className="w-full p-4 rounded-xl bg-[#0E1016] border border-white/5 font-mono text-xs text-gold text-left space-y-1">
              <div>src/media/photos/keynotes/ → Keynotes category</div>
              <div>src/media/photos/ventures/ → Ventures category</div>
              <div>src/media/photos/leadership/ → Leadership category</div>
            </div>
          </div>
        )}
      </div>

      {/* Yet Another React Lightbox Modal */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions, Thumbnails, Slideshow]}
        animation={{ fade: 300, swipe: 400 }}
        carousel={{ finite: false }}
        styles={{
          container: { backgroundColor: 'rgba(7, 8, 11, 0.95)' },
          thumbnail: { borderColor: '#D4AF37' },
        }}
      />
    </div>
  );
};
