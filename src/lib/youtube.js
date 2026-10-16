// Accepts any common YouTube URL form or a bare 11-char ID and returns the ID (or null).
//   https://www.youtube.com/watch?v=ID&t=30s
//   https://youtu.be/ID
//   https://www.youtube.com/embed/ID
//   https://www.youtube.com/shorts/ID
//   https://youtube.com/live/ID
//   ID
const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeId(input) {
  if (!input) return null;
  const value = String(input).trim();
  if (ID_RE.test(value)) return value;

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\.|^m\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/')[1];
      return ID_RE.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => ['embed', 'shorts', 'live', 'v'].includes(p));
      if (idx !== -1 && ID_RE.test(parts[idx + 1] || '')) return parts[idx + 1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export const ytThumb = (id, quality = 'maxresdefault') =>
  id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;

export const ytEmbed = (id, { autoplay = true, background = false } = {}) => {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (background) {
    params.set('mute', '1');
    params.set('controls', '0');
    params.set('loop', '1');
    params.set('playlist', id); // required for loop to work
    params.set('disablekb', '1');
    params.set('iv_load_policy', '3');
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};
