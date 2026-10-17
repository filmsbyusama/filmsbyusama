import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useRef } from 'react';
import { InstagramIcon, TikTokIcon, VimeoIcon, YouTubeIcon } from './BrandIcons';
import { NAV } from './Navbar';

export default function Footer({ settings = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const rotateX = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const brand = settings.studioName || 'filmsbyusama';

  const socials = [
    { href: settings.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.youtube, label: 'YouTube', Icon: YouTubeIcon },
    { href: settings.vimeo, label: 'Vimeo', Icon: VimeoIcon },
    { href: settings.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line/10 bg-bg pt-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-3xl leading-tight">Capturing timeless love stories — one honest frame at a time.</p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className="eyebrow mb-5">Explore</p>
            <ul className="grid grid-cols-2 gap-y-2.5 md:grid-cols-1">
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-muted transition-colors hover:text-accent">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Follow the work</p>
            <div className="flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-line/15 text-ink transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:text-accent"
                >
                  <Icon />
                </a>
              ))}
            </div>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="mt-6 block text-xl transition-colors hover:text-accent">
                {settings.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Oversized wordmark that tips up into place as you reach the bottom */}
      <div className="mt-16 overflow-hidden" style={{ perspective: 800 }} aria-hidden>
        <motion.p
          style={{ y, rotateX, transformOrigin: '50% 100%' }}
          className="select-none whitespace-nowrap text-center text-[15.5vw] leading-[0.85] text-ink/[0.07] dark:text-ink/[0.06]"
        >
          {brand}
        </motion.p>
      </div>

      <div className="border-t border-line/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-6 text-[0.68rem] uppercase tracking-[0.22em] text-muted sm:flex-row sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {/* Discreet admin entry — a plain link so Netlify serves /admin/index.html */}
            <a href="/admin/" className="opacity-40 transition-opacity hover:opacity-100" rel="nofollow">
              Studio
            </a>
            <a href="#home" className="flex items-center gap-2 transition-colors hover:text-accent">
              Back to top <ArrowUp size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
