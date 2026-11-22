import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, FolderPlus, Youtube, Tv } from 'lucide-react';
import { getAllVideos, VideoItem } from '@/lib/media';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleMouseEnter = () => {
    if (!video.isExternal && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!video.isExternal && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlayingPreview(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-[20px] overflow-hidden bg-[#0E1016] border border-white/10 hover:border-gold/50 transition-all duration-500 flex flex-col cursor-pointer shadow-xl"
      data-cursor="play"
    >
      {/* 16:9 Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#07080B]">
        {video.isExternal ? (
          // External YouTube / Vimeo Thumbnail
          <img
            src={video.poster || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes('maxresdefault.jpg')) {
                target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
              }
            }}
            loading="lazy"
          />
        ) : (
          // Local MP4 / WebM with silent hover preview
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            preload="metadata"
            muted
            playsInline
            loop
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}

        {/* Category & Source Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#07080B]/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-teal tracking-widest uppercase">
            {video.category}
          </span>
          {video.isExternal && (
            <span className="px-2.5 py-1 rounded-full bg-[#07080B]/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-gold tracking-widest uppercase flex items-center gap-1">
              {video.externalProvider === 'youtube' ? (
                <>
                  <Youtube className="w-3 h-3 text-red-500" />
                  <span>YouTube</span>
                </>
              ) : (
                <>
                  <Tv className="w-3 h-3 text-teal" />
                  <span>Vimeo</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Center Pulsing Gold Play Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isPlayingPreview ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-[#07080B]/80 backdrop-blur-md border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:scale-115 group-hover:bg-gold group-hover:text-[#07080B] transition-all">
            <Play className="w-6 h-6 ml-1 fill-current" />
          </div>
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-fraunces text-xl font-normal text-[#EDEAE3] group-hover:text-gold-light transition-colors line-clamp-2 mb-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-text-muted text-xs font-light leading-relaxed line-clamp-2">
              {video.description}
            </p>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#8C8A85]">
          <span>{video.date || 'FEATURED RECORDING'}</span>
          <span className="text-gold group-hover:translate-x-1 transition-transform">
            WATCH →
          </span>
        </div>
      </div>
    </div>
  );
};

export const Videos: React.FC = () => {
  const allVideos = useMemo(() => getAllVideos(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allVideos.forEach((v) => set.add(v.category));
    return ['All', ...Array.from(set)];
  }, [allVideos]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'All') return allVideos;
    return allVideos.filter((v) => v.category === selectedCategory);
  }, [allVideos, selectedCategory]);

  return (
    <div className="relative w-full min-h-screen bg-[#07080B] text-text pt-32 pb-24 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-teal/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Page Hero */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-teal tracking-[0.25em] uppercase">
              CINEMATIC ARCHIVE
            </span>
            <span className="w-1 h-1 rounded-full bg-teal" />
            <span className="font-mono text-xs text-text-muted">
              {allVideos.length} BROADCASTS · {categories.length - 1} TOPICS
            </span>
          </div>

          <h1 className="font-fraunces text-4xl sm:text-6xl lg:text-7xl font-normal text-gold-gradient tracking-tight mb-6">
            In Motion
          </h1>

          <p className="text-text-muted text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Keynotes, product demonstrations, architectural walkthroughs, and strategic perspectives presented across global summits and innovation summits.
          </p>
        </div>

        {/* Category Filter Chips */}
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
                      layoutId="activeVideoCategoryChip"
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

        {/* Videos Grid or Empty State */}
        {filteredVideos.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <VideoCard video={video} onSelect={(v) => setActiveVideo(v)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="w-full py-24 px-8 rounded-[20px] bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-6 shadow-[0_0_20px_rgba(45,226,199,0.2)]">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="font-fraunces text-2xl sm:text-3xl font-normal text-[#EDEAE3] mb-3">
              Drop Videos to Auto-Populate
            </h3>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
              Add your .mp4 or .webm files into subfolders under <code className="text-gold">src/media/videos/</code> or embed YouTube / Vimeo links in <code className="text-gold">links.json</code>.
            </p>
            <div className="w-full p-4 rounded-xl bg-[#0E1016] border border-white/5 font-mono text-xs text-gold text-left space-y-1">
              <div>src/media/videos/talks/ → Talks category</div>
              <div>src/media/videos/demos/ → Demos category</div>
              <div>src/media/videos/links.json → External YouTube / Vimeo links</div>
            </div>
          </div>
        )}
      </div>

      {/* Full Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveVideo(null)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl rounded-[20px] overflow-hidden bg-[#0E1016] border border-gold/30 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#07080B]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-teal tracking-widest uppercase">
                    {activeVideo.category}
                  </span>
                  <span className="text-white/20">|</span>
                  <h3 className="font-fraunces text-base sm:text-lg text-[#EDEAE3] line-clamp-1">
                    {activeVideo.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-gold transition-colors"
                  data-cursor="hover"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-video w-full bg-black">
                {activeVideo.isExternal ? (
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeVideo.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Bottom Details */}
              {activeVideo.description && (
                <div className="p-6 bg-[#0E1016] border-t border-white/5">
                  <p className="text-text-muted text-sm font-light leading-relaxed">
                    {activeVideo.description}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
