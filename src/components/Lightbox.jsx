import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ease } from './motion';

export default function Lightbox({ photos, index, onClose, onIndex }) {
  const open = index !== null && index !== undefined;
  const [dir, setDir] = useState(0);
  const count = photos.length;

  const go = useCallback(
    (step) => {
      setDir(step);
      onIndex((i) => (i + step + count) % count);
    },
    [count, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go, onClose]);

  const photo = open ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-deep/95 text-ondeep backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ondeep/60">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:rotate-90 hover:border-accentdeep hover:text-accentdeep"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={photo.image}
                src={photo.image}
                alt={photo.caption || ''}
                custom={dir}
                variants={{
                  enter: (d) => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d) => ({ x: d > 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                className="max-h-[78vh] max-w-full cursor-grab select-none object-contain shadow-2xl active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur transition-colors hover:border-accentdeep hover:text-accentdeep sm:flex"
                >
                  <ChevronLeft size={20} strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur transition-colors hover:border-accentdeep hover:text-accentdeep sm:flex"
                >
                  <ChevronRight size={20} strokeWidth={1.4} />
                </button>
              </>
            )}
          </div>

          <div className="px-5 py-6 text-center sm:px-8">
            {photo.caption && <p className="text-2xl">{photo.caption}</p>}
            {photo.couple && <p className="mt-1 text-[0.68rem] uppercase tracking-[0.3em] text-accentdeep">{photo.couple}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
