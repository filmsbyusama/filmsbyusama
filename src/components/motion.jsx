import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export const ease = [0.22, 1, 0.36, 1];

/* Fade + rise when scrolled into view */
export function Reveal({ children, delay = 0, y = 40, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Parent/child variants for staggered grids */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
export const staggerChild = {
  hidden: { opacity: 0, y: 50, rotateX: 14 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease } },
};

/* Word-by-word masked headline reveal */
export function SplitWords({ text = '', className = '', delay = 0, inView = true }) {
  const words = text.split(' ');
  const animateProps = inView
    ? { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
    : { animate: 'show' };
  return (
    <motion.span
      className={className}
      initial="hidden"
      {...animateProps}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', rotate: 4, opacity: 0 },
              show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.1, ease } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* 3D tilt on pointer move:  perspective(1000px) rotateX() rotateY() + soft glare */
export function TiltCard({ children, className = '', max = 9, glare = true, ...rest }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.45), transparent 55%)`
  );
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    setHover(false);
  };

  return (
    <div style={{ perspective: 1000 }} className={className} {...rest}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light transition-opacity duration-500"
            style={{ opacity: hover ? 1 : 0, background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* Image with graceful fallback (next source → elegant placeholder) */
export function SmartImage({ src, fallbacks = [], alt = '', className = '', label = '', ...rest }) {
  const sources = [src, ...fallbacks].filter(Boolean);
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (!sources.length || i >= sources.length) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gold/25 via-surface to-ink/10`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center text-sm italic tracking-wide text-muted">{label || 'filmsbyusama'}</span>
      </div>
    );
  }
  return (
    <img
      src={sources[i]}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false);
        setI((n) => n + 1);
      }}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      {...rest}
    />
  );
}

/* Numbered editorial section header */
export function SectionHeading({ index, eyebrow, title, children, align = 'left' }) {
  return (
    <div className={`mb-14 md:mb-20 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'grid gap-8 md:grid-cols-12 md:items-end'}`}>
      <div className={align === 'center' ? '' : 'md:col-span-7'}>
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-4 justify-start">
            {index && <span className="text-muted">{index}</span>}
            <span className="h-px w-10 bg-gold/60" />
            <span>{eyebrow}</span>
          </p>
        </Reveal>
        <h2 className="display text-[2.6rem] sm:text-6xl lg:text-7xl">
          <SplitWords text={title} />
        </h2>
      </div>
      {children && (
        <Reveal delay={0.2} className={align === 'center' ? 'mt-6 text-muted' : 'md:col-span-5 md:pb-3 text-muted max-w-md'}>
          {children}
        </Reveal>
      )}
    </div>
  );
}
