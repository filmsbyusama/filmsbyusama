import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getYouTubeId, ytEmbed } from '../lib/youtube';
import { SmartImage, SplitWords, ease } from './motion';

export default function Hero({ settings = {}, onPlayReel }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // 3D perspective parallax: the media plane tilts back and sinks as you scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const radius = useTransform(scrollYProgress, [0, 0.6], [0, 28]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.35, 0.8]);

  const reelId = getYouTubeId(settings.heroYoutube);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => setVideoReady(false), [reelId]);

  const title = settings.tagline || 'Capturing Timeless Love Stories';

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0D0D0D]" style={{ perspective: 1200 }}>
      {/* Media plane */}
      <motion.div
        style={{ rotateX, scale, y, borderRadius: radius, transformOrigin: '50% 100%' }}
        className="absolute inset-0 overflow-hidden will-change-transform"
      >
        <SmartImage
          src={settings.heroImage}
          alt=""
          label=" "
          className="absolute inset-0 h-full w-full animate-kenburns object-cover"
          fetchpriority="high"
          loading="eager"
        />

        {reelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 2, ease }}
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <iframe
              title="Showreel"
              src={ytEmbed(reelId, { background: true })}
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
              onLoad={() => setTimeout(() => setVideoReady(true), 1200)}
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.15] border-0"
            />
          </motion.div>
        )}

        {/* Cinematic overlays */}
        <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-[#0D0D0D]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        <div className="grain absolute inset-0 overflow-hidden" />
      </motion.div>

      {/* Headline */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.6 }}
          className="eyebrow mb-6 flex items-center gap-4 !text-[#E5C158]"
        >
          <span className="h-px w-10 bg-[#E5C158]/70" /> Wedding Films &amp; Photography
        </motion.p>

        <h1 className="display max-w-5xl text-[3.1rem] text-[#F0F0F0] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          <SplitWords text={title} inView={false} delay={0.75} />
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.4 }}
            className="max-w-md text-[1.05rem] leading-relaxed text-[#F0F0F0]/75"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button type="button" onClick={onPlayReel} className="group flex items-center gap-4 text-[#F0F0F0]">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#F0F0F0]/40 transition-all duration-500 group-hover:scale-110 group-hover:border-[#E5C158]">
                <span className="absolute inset-0 animate-ping rounded-full border border-[#E5C158]/40 [animation-duration:2.5s]" />
                <Play size={16} className="translate-x-[1px] fill-current" />
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.28em]">Watch the reel</span>
            </button>
            <a href="#contact" className="btn bg-[#E5C158] text-[#0D0D0D] hover:bg-[#F0F0F0]">
              Check your date
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#films"
        style={{ opacity: contentOpacity }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[#F0F0F0]/70 sm:flex"
        aria-label="Scroll to films"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-[#F0F0F0]/40 pt-2">
          <span className="block h-2 w-px animate-scrolldot bg-[#E5C158]" />
        </span>
        <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
      </motion.a>

      {settings.location && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-12 z-10 hidden text-[0.65rem] uppercase tracking-[0.3em] text-[#F0F0F0]/60 lg:block"
        >
          {settings.location}
        </motion.p>
      )}
    </section>
  );
}
