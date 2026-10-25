import { useEffect, useState } from 'react';

// ------------------------------------------------------------------
// Content loading — zero-credit editing
//
// All editable content lives in /public/content/*.json in the GitHub repo.
// The admin panel (/admin, Decap CMS) commits changes there. Instead of
// waiting for a Netlify rebuild (15 credits each), the site reads the JSON
// straight from GitHub, so edits appear ~5 minutes after you click Publish.
// netlify.toml skips builds for content-only commits.
//
// If GitHub can't be reached, the copy bundled with the last deploy is used.
// ------------------------------------------------------------------
const REPO = 'filmsbyusama/filmsbyusama';
const BRANCH = 'main';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public`;

const FILES = ['settings', 'films', 'photos', 'packages', 'testimonials'];

const EMPTY = {
  settings: {},
  films: { items: [] },
  photos: { items: [] },
  packages: { items: [] },
  testimonials: { items: [] },
};

// Uploaded photos (public/uploads) are always stored in the repo exactly as
// uploaded. When the site shows them, each image can be delivered either as
// the untouched original, or resized + compressed by a free image CDN
// (wsrv.nl) — e.g. a 15 MB camera file becomes a ~300 KB WebP.
//
// The level is chosen per photo/film in the admin panel ("Image quality"),
// with a site-wide default in Site Settings. Values must match config.yml.
export const QUALITY_PRESETS = {
  original: null, //                    exactly as uploaded
  maximum: { q: 95, w: 3000 }, //       near-lossless, large files
  high: { q: 90, w: 2560 }, //          crisp on big retina screens
  balanced: { q: 82, w: 2000 }, //      recommended
  light: { q: 70, w: 1400 }, //         fastest on mobile data
};
const DEFAULT_QUALITY = 'balanced';
const UPLOAD_RE = /^(?:https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/public)?\/uploads\/(.+)$/;

export function uploadOriginal(path) {
  return `${RAW}/uploads/${path}`;
}

export function optimiseImage(url, quality = DEFAULT_QUALITY) {
  if (typeof url !== 'string') return url;
  const m = url.match(UPLOAD_RE);
  if (!m) return url;
  const original = uploadOriginal(m[1]);
  const preset = quality in QUALITY_PRESETS ? QUALITY_PRESETS[quality] : QUALITY_PRESETS[DEFAULT_QUALITY];
  if (!preset) return original;
  return `https://wsrv.nl/?url=${encodeURIComponent(original)}&w=${preset.w}&we&output=webp&q=${preset.q}`;
}

// Undo optimiseImage — used as a fallback if the image CDN is ever down.
export function originalOf(url) {
  if (typeof url !== 'string' || !url.startsWith('https://wsrv.nl/')) return null;
  try {
    return new URL(url).searchParams.get('url');
  } catch {
    return null;
  }
}

// Walks the content and rewrites every uploaded-image URL. An object's own
// `quality` field (a photo or film) wins over the inherited default.
function rewriteImages(value, quality) {
  if (Array.isArray(value)) return value.map((v) => rewriteImages(v, quality));
  if (value && typeof value === 'object') {
    const q = typeof value.quality === 'string' && value.quality !== 'default' ? value.quality : quality;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteImages(v, q)]));
  }
  return optimiseImage(value, quality);
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function load(name) {
  try {
    // A per-minute version keeps browsers from holding on to an old copy.
    return await fetchJson(`${RAW}/content/${name}.json?v=${Math.floor(Date.now() / 60000)}`);
  } catch (err) {
    console.warn(`[content] GitHub copy of ${name}.json unavailable, using bundled copy`, err);
  }
  try {
    return await fetchJson(`/content/${name}.json`);
  } catch (err) {
    console.warn(`[content] could not load ${name}.json`, err);
    return EMPTY[name];
  }
}

export function useContent() {
  const [state, setState] = useState({ ...EMPTY, ready: false });

  useEffect(() => {
    let alive = true;
    Promise.all(FILES.map(load)).then((results) => {
      if (!alive) return;
      const next = { ready: true };
      const siteDefault = results[FILES.indexOf('settings')]?.imageQuality || DEFAULT_QUALITY;
      FILES.forEach((name, i) => (next[name] = rewriteImages(results[i] || EMPTY[name], siteDefault)));
      setState(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
