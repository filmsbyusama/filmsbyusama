import { AnimatePresence, motion } from 'framer-motion';
import { Film, X } from 'lucide-react';
import { useEffect } from 'react';
import { getYouTubeId, ytEmbed } from '../lib/youtube';
import { ease } from './motion';

// Glassmorphism YouTube player. `video` = { title, couple, youtube, location } | null
export default function VideoModal({ video, onClose }) {
  const id = getYouTubeId(video?.youtube);

  useEffect(() => {
    if (!video) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={video.title || 'Wedding film'}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateX: 12, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.7, ease }}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-6xl rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-3"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              {id ? (
                <iframe
                  title={video.title || 'Wedding film'}
                  src={ytEmbed(id)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-ondeep">
                  <Film size={28} strokeWidth={1.2} className="text-accentdeep" />
                  <p className="text-2xl">This film is coming soon</p>
                  <p className="max-w-sm text-sm text-ondeep/60">
                    Studio tip: open <span className="text-accentdeep">/admin</span> → Films and paste a YouTube link to publish it here.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-3 text-ondeep sm:px-3">
              <div className="min-w-0">
                <p className="truncate text-lg leading-tight sm:text-xl">{video.title}</p>
                {(video.couple || video.location) && (
                  <p className="truncate text-[0.68rem] uppercase tracking-[0.26em] text-ondeep/55">
                    {[video.couple, video.location].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:rotate-90 hover:border-accentdeep hover:text-accentdeep"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
