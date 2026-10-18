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

// Uploaded photos (public/uploads) are served from GitHub through a free
// image CDN that resizes and compresses them, so a 15 MB camera file reaches
// visitors as a ~300 KB WebP and costs no Netlify bandwidth.
const IMAGE_WIDTH = 2000;
const UPLOAD_RE = /^(?:https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/public)?\/uploads\/(.+)$/;

export function uploadOriginal(path) {
  return `${RAW}/uploads/${path}`;
}

export function optimiseImage(url) {
  if (typeof url !== 'string') return url;
  const m = url.match(UPLOAD_RE);
  if (!m) return url;
  const original = uploadOriginal(m[1]);
  return `https://wsrv.nl/?url=${encodeURIComponent(original)}&w=${IMAGE_WIDTH}&we&output=webp&q=82`;
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

function rewriteImages(value) {
  if (Array.isArray(value)) return value.map(rewriteImages);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteImages(v)]));
  }
  return optimiseImage(value);
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
      FILES.forEach((name, i) => (next[name] = rewriteImages(results[i] || EMPTY[name])));
      setState(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
