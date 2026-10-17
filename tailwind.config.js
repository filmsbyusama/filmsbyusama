/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware palette tokens — values live in src/index.css
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        onaccent: 'rgb(var(--on-accent) / <alpha-value>)',
        deep: 'rgb(var(--deep) / <alpha-value>)',
        ondeep: 'rgb(var(--on-deep) / <alpha-value>)',
        accentdeep: 'rgb(var(--accent-deep) / <alpha-value>)',
      },
      fontFamily: {
        queensides: ['Queensides', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Queensides', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['Queensides', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        editorial: '0.32em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.08) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.22) translate3d(-2%, -2%, 0)' },
        },
        scrolldot: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(18px)', opacity: '0' },
        },
      },
      animation: {
        kenburns: 'kenburns 24s ease-in-out infinite alternate',
        scrolldot: 'scrolldot 2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
};
