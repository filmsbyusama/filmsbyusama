import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Reveal, ease } from './motion';

const INTERVAL = 6500;

export default function Testimonials({ items = [] }) {
  const [[i, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback((step) => setState(([n]) => [(n + step + count) % count, step]), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, count, go]);

  if (!count) return null;
  const t = items[i];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden py-28 md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow mb-10 flex items-center justify-center gap-4">
            <span className="text-muted">05</span>
            <span className="h-px w-10 bg-gold/60" />
            Kind Words
          </p>
        </Reveal>

        <span className="block select-none text-[7rem] leading-[0.5] text-gold/70 sm:text-[10rem]" aria-hidden>
          “
        </span>

        <div className="relative min-h-[300px] sm:min-h-[260px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, x: d * 60, filter: 'blur(6px)' }),
                center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                exit: (d) => ({ opacity: 0, x: d * -60, filter: 'blur(6px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <blockquote className="mx-auto max-w-4xl text-[1.75rem] leading-[1.3] sm:text-4xl lg:text-[2.75rem]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-10">
                <p className="text-2xl italic text-gold">{t.name}</p>
                {t.event && <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-muted">{t.event}</p>}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-12 flex items-center justify-center gap-8">
            <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/20 transition-colors hover:border-gold hover:text-gold">
              <ArrowLeft size={16} strokeWidth={1.4} />
            </button>
            <div className="flex items-center gap-2.5">
              {items.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setState([n, n > i ? 1 : -1])}
                  aria-label={`Show review ${n + 1}`}
                  className="relative h-[3px] w-8 overflow-hidden bg-line/15"
                >
                  {n === i && (
                    <motion.span
                      key={`${i}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-gold"
                      initial={{ width: paused ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next review" className="flex h-11 w-11 items-center justify-center rounded-full border border-line/20 transition-colors hover:border-gold hover:text-gold">
              <ArrowRight size={16} strokeWidth={1.4} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
