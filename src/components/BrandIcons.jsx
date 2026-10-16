// Small, stroke-style brand marks so they sit nicely next to Lucide icons.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const InstagramIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const YouTubeIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor" />
  </svg>
);

export const VimeoIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 9l1.4 1.6c1.2-.9 2.1-1.3 2.6-.3.9 1.9 2.2 8.7 4.3 8.7 2.5 0 6.5-6.1 7.7-9.6.9-2.6-.1-4.6-2.4-4.4-1.6.1-3.3 1.4-4 3.4 1.7-.8 2.7-.1 2.1 1.6-.7 2-2.3 4-3 4-.9 0-2-6.7-3.1-8.3C8.6 4.2 6.4 5.9 3 9z" />
  </svg>
);

export const TikTokIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.6 2.4 4.6 5 4.8" />
  </svg>
);

export const WhatsAppIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
    <path d="M9 8.5c0 3.5 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2z" />
  </svg>
);
