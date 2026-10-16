import { motion, useScroll, useTransform } from 'framer-motion';

const WORDS = ['Nikkah', 'Mehndi', 'Baraat', 'Walima', 'Destination', 'Pre-wedding', 'Engagement'];

// Scroll-linked editorial marquee — moves with the page, not on a timer
export default function Marquee() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const row = [...WORDS, ...WORDS, ...WORDS];

  return (
    <div className="relative overflow-hidden border-y border-line/10 py-7" aria-hidden>
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center text-4xl italic text-ink/80 sm:text-6xl">
            <span className="px-8">{w}</span>
            <span className="text-2xl text-gold">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
