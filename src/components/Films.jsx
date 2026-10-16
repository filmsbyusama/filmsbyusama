import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getYouTubeId, ytThumb } from '../lib/youtube';
import { SectionHeading, SmartImage, TiltCard, ease } from './motion';

const SM = {
  tall: 'sm:col-span-1 sm:aspect-[4/5]',
  wide: 'sm:col-span-2 sm:aspect-[16/9]',
};
const LG = {
  tall: 'lg:col-span-2 lg:aspect-[4/5]',
  half: 'lg:col-span-3 lg:aspect-[16/10]',
  full: 'lg:col-span-6 lg:aspect-[21/9]',
};

// Gives every card a size so rows always fill edge-to-edge, whatever the count.
function arrange(list) {
  const featured = list.filter((f) => f.featured);
  const rest = list.filter((f) => !f.featured);
  const out = [];

  featured.forEach((f, i) => {
    const lastOdd = featured.length % 2 === 1 && i === featured.length - 1;
    out.push({ ...f, sm: 'wide', lg: lastOdd ? 'full' : 'half' });
  });

  const r = rest.length % 3;
  rest.forEach((f, i) => {
    let lg = 'tall';
    if (r === 1 && i === rest.length - 1) lg = 'full';
    if (r === 2 && i >= rest.length - 2) lg = 'half';
    const sm = rest.length % 2 === 1 && i === rest.length - 1 ? 'wide' : 'tall';
    out.push({ ...f, sm, lg });
  });
  return out;
}

function FilmCard({ film, onPlay }) {
  const id = getYouTubeId(film.youtube);
  const big = film.featured;
  return (
    <TiltCard className="h-full" max={big ? 5 : 8}>
      <button
        type="button"
        onClick={() => onPlay(film)}
        className="group relative block h-full w-full overflow-hidden bg-surface text-left"
        aria-label={`Play ${film.title}${film.couple ? ` — ${film.couple}` : ''}`}
      >
        <SmartImage
          src={film.cover}
          fallbacks={id ? [ytThumb(id, 'maxresdefault'), ytThumb(id, 'hqdefault')] : []}
          alt={film.title}
          label={film.couple}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-cinematic group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />

        {/* Play button floats above the card in 3D */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(60px)' }}>
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur-md transition-all duration-700 ease-cinematic group-hover:scale-110 group-hover:border-[#E5C158] group-hover:bg-[#E5C158] group-hover:text-[#0D0D0D] sm:h-20 sm:w-20">
            <Play size={20} className="translate-x-[2px] fill-current" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-[#F0F0F0] sm:p-7" style={{ transform: 'translateZ(40px)' }}>
          <div className="mb-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.3em] text-[#E5C158]">
            <span>{film.category}</span>
            {film.featured && <span className="rounded-full border border-[#E5C158]/50 px-2 py-0.5 text-[0.55rem]">Featured</span>}
            {!id && <span className="text-[#F0F0F0]/50">Coming soon</span>}
          </div>
          <h3 className={`leading-[1.05] ${big ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-3xl'}`}>{film.title}</h3>
          <p className="mt-2 text-sm text-[#F0F0F0]/70">
            {film.couple}
            {film.location && <span className="text-[#F0F0F0]/45"> · {film.location}</span>}
          </p>
        </div>
      </button>
    </TiltCard>
  );
}

export default function Films({ films = [], onPlay }) {
  const categories = useMemo(() => {
    const seen = [];
    films.forEach((f) => f.category && !seen.includes(f.category) && seen.push(f.category));
    return ['All', ...seen];
  }, [films]);
  const [active, setActive] = useState('All');

  const visible = useMemo(
    () => arrange(active === 'All' ? films : films.filter((f) => f.category === active)),
    [films, active]
  );

  return (
    <section id="films" className="relative mx-auto max-w-[1400px] scroll-mt-20 px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <SectionHeading index="01" eyebrow="Wedding Films" title="Stories you can feel">
        Each film is shaped like a short feature — your vows, your people, your music — cut to be watched again on every anniversary.
      </SectionHeading>

      {categories.length > 2 && (
        <LayoutGroup>
          <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Film categories">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] transition-colors duration-500 ${
                  active === c ? 'text-[#0D0D0D]' : 'text-muted hover:text-ink'
                }`}
              >
                {active === c && (
                  <motion.span layoutId="film-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      )}

      {films.length === 0 ? (
        <p className="py-20 text-center text-muted">Films will appear here once they're added in the admin panel.</p>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((film, i) => (
              <motion.div
                layout
                key={`${film.title}-${film.couple}`}
                initial={{ opacity: 0, y: 60, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1, ease, delay: (i % 3) * 0.1 }}
                style={{ transformPerspective: 1200, transformOrigin: '50% 100%' }}
                className={`aspect-[4/5] ${SM[film.sm]} ${LG[film.lg]}`}
              >
                <FilmCard film={film} onPlay={onPlay} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
