import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, toggle, className = '' }) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex h-8 w-[3.75rem] items-center rounded-full border border-line/15 bg-surface/70 px-1 transition-colors duration-500 hover:border-accent/60 ${className}`}
    >
      <Sun size={12} strokeWidth={1.6} className="absolute left-[0.55rem] text-muted" aria-hidden />
      <Moon size={12} strokeWidth={1.6} className="absolute right-[0.55rem] text-muted" aria-hidden />
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-onaccent shadow-[0_2px_10px_rgba(0,0,0,0.2)] ${dark ? 'ml-auto' : ''}`}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          {dark ? <Moon size={12} strokeWidth={2} /> : <Sun size={12} strokeWidth={2} />}
        </motion.span>
      </motion.span>
    </button>
  );
}
