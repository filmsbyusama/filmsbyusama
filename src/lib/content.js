import { useEffect, useState } from 'react';

// All editable content lives in /public/content/*.json.
// The admin panel (/admin, Decap CMS) edits these files in your Git repo,
// Netlify rebuilds, and the site picks up the new JSON on the next visit.
const FILES = ['settings', 'films', 'photos', 'packages', 'testimonials'];

const EMPTY = {
  settings: {},
  films: { items: [] },
  photos: { items: [] },
  packages: { items: [] },
  testimonials: { items: [] },
};

async function load(name) {
  try {
    const res = await fetch(`/content/${name}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
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
      FILES.forEach((name, i) => (next[name] = results[i] || EMPTY[name]));
      setState(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
