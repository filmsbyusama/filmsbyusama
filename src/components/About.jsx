import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Reveal, SmartImage, SplitWords, ease } from './motion';

const PILLARS = [
  { n: 'I', title: 'Listen first', text: 'Before any camera comes out, we learn how you met, who makes you laugh, and what you never want to forget.' },
  { n: 'II', title: 'Direct gently', text: 'Light guidance, never stiff posing. We shape the moment, then step back and let it happen.' },
  { n: 'III', title: 'Tell it honestly', text: 'Real sound, real tears, real dancing. Edited with the rhythm of cinema, not a slideshow.' },
];

export default function About({ settings = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const paragraphs = (settings.aboutText || '').split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="story" ref={ref} className="relative mx-auto max-w-[1400px] scroll-mt-20 px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Portrait with inner parallax and a floating gold frame */}
        <div className="relative lg:col-span-5" style={{ perspective: 1200 }}>
          <motion.div
            style={{ rotateY: frameRotate }}
            className="absolute -inset-4 border border-gold/40 sm:-inset-6"
            aria-hidden
          />
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.6, ease }}
            className="relative aspect-[4/5] overflow-hidden bg-surface"
          >
            <motion.div style={{ y: imgY }} className="absolute -inset-y-[14%] inset-x-0">
              <SmartImage src={settings.aboutImage} alt="Usama behind the camera" className="h-full w-full object-cover" />
            </motion.div>
          </motion.div>
          <p className="absolute -bottom-10 right-0 text-[0.65rem] uppercase tracking-[0.3em] text-muted">Usama — Director &amp; Photographer</p>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-4">
              <span className="text-muted">03</span>
              <span className="h-px w-10 bg-gold/60" />
              The Story
            </p>
          </Reveal>
          <h2 className="display mb-10 text-[2.4rem] sm:text-5xl lg:text-6xl">
            <SplitWords text={settings.aboutTitle || ''} />
          </h2>
          <div className="space-y-5 text-[1.1rem] text-muted">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <p className="mt-8 text-4xl italic text-gold">— Usama</p>
          </Reveal>

          {Array.isArray(settings.stats) && settings.stats.length > 0 && (
            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-line/10 pt-10">
              {settings.stats.map((s, i) => (
                <Reveal key={i} delay={0.12 * i}>
                  <p className="text-4xl leading-none text-ink sm:text-6xl">{s.value}</p>
                  <p className="mt-3 text-[0.62rem] uppercase tracking-[0.24em] text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Philosophy pillars */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        className="mt-32 grid gap-px overflow-hidden border border-line/10 bg-line/10 md:grid-cols-3"
      >
        {PILLARS.map((p) => (
          <motion.div
            key={p.n}
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease } } }}
            className="group bg-bg p-8 transition-colors duration-700 hover:bg-surface sm:p-10"
          >
            <span className="text-sm italic text-gold">{p.n}</span>
            <h3 className="mt-6 text-3xl">{p.title}</h3>
            <p className="mt-3 text-muted">{p.text}</p>
            <span className="mt-8 block h-px w-8 bg-gold transition-all duration-700 group-hover:w-20" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
