import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { ease } from './motion';

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'films', label: 'Films' },
  { id: 'photography', label: 'Photography' },
  { id: 'story', label: 'Story' },
  { id: 'packages', label: 'Packages' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ theme, toggle, brand = 'filmsbyusama', ready = true }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 500 && !open);
  });

  // Highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // Over the dark hero the bar stays light-on-dark until you scroll
  const onHero = !scrolled && !open;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ${
          scrolled ? 'glass border-x-0 border-t-0' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#home"
            className={`text-[1.55rem] leading-none tracking-[0.01em] transition-colors duration-500 ${
              onHero ? 'text-[#F0F0F0]' : 'text-ink'
            }`}
            aria-label={`${brand} — home`}
          >
            {brand}
            <span className="text-gold">.</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`group relative py-2 text-[0.7rem] uppercase tracking-[0.26em] transition-colors duration-300 ${
                    onHero ? 'text-[#F0F0F0]/80 hover:text-[#F0F0F0]' : 'text-ink/70 hover:text-ink'
                  } ${active === id ? (onHero ? '!text-[#F0F0F0]' : '!text-ink') : ''}`}
                >
                  {label}
                  {active === id ? (
                    <motion.span layoutId="nav-underline" className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold" />
                  ) : (
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold/70 transition-all duration-500 group-hover:w-full" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggle={toggle} />
            <a href="#contact" className={`hidden sm:inline-flex btn !px-5 !py-2.5 border transition-colors duration-500 ${
              onHero ? 'border-[#F0F0F0]/40 text-[#F0F0F0] hover:border-gold hover:text-gold' : 'border-ink/25 text-ink hover:border-gold hover:text-gold'
            }`}>
              Book
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  animate={open ? { rotate: i ? -45 : 45, y: i ? -3.5 : 3.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className={`block h-px w-6 ${onHero ? 'bg-[#F0F0F0]' : 'bg-ink'}`}
                />
              ))}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.9, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-bg px-6 pt-28 pb-10 lg:hidden"
          >
            <ul className="flex flex-1 flex-col justify-center gap-2">
              {NAV.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease }}
                >
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-1 text-5xl text-ink"
                  >
                    <span className="text-xs text-gold">0{i + 1}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow">Capturing timeless love stories</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
