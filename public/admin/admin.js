/* ==================================================================
   filmsbyusama — admin panel extras for Decap CMS
   • Live previews that look like the real website (right-hand pane)
   • Sidebar shortcuts: live site, customer inquiries, Netlify usage
   Loaded after decap-cms.js in admin/index.html.
   ================================================================== */
(function () {
  if (!window.CMS) {
    console.error('[admin] Decap CMS failed to load');
    return;
  }
  var CMS = window.CMS;
  var h = window.h;
  var RAW = 'https://raw.githubusercontent.com/filmsbyusama/filmsbyusama/main/public';

  // ---------- helpers ----------
  function toJS(v) { return v && v.toJS ? v.toJS() : v; }
  function data(entry) { return toJS(entry.get('data')) || {}; }
  function img(props, src) {
    if (!src) return '';
    if (/^\/uploads\//.test(src)) return RAW + src;
    try { var a = props.getAsset(src); return a ? a.toString() : src; } catch (e) { return src; }
  }
  function ytId(v) {
    if (!v) return null;
    var m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(String(v).trim()) ? String(v).trim() : null;
  }
  var QUALITY = { original: 'Original', maximum: 'Maximum 95%', high: 'High 90%', balanced: 'Balanced 82%', light: 'Light 70%' };
  function qualityTag(q, siteDefault) {
    var label = q && q !== 'default' ? QUALITY[q] : 'Default · ' + (QUALITY[siteDefault] || 'Balanced 82%');
    return h('span', { className: 'tag' }, label);
  }
  function section(eyebrow, title, children) {
    return h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, eyebrow),
      h('h1', { className: 'title' }, title),
      children);
  }
  function empty(text) { return h('p', { className: 'empty' }, text); }

  // ---------- previews ----------
  function FilmsPreview(props) {
    var items = data(props.entry).items || [];
    return section('Wedding films', items.length + (items.length === 1 ? ' film' : ' films') + ' on the site',
      items.length ? h('div', { className: 'grid' }, items.map(function (f, i) {
        var id = ytId(f.youtube);
        var cover = img(props, f.cover) || (id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : '');
        return h('article', { key: i, className: 'card' + (f.featured ? ' featured' : '') },
          h('div', { className: 'media', style: cover ? { backgroundImage: 'url("' + cover + '")' } : {} },
            h('span', { className: 'play' }, '▶'),
            f.featured ? h('span', { className: 'badge' }, 'Featured') : null),
          h('div', { className: 'body' },
            h('p', { className: 'meta' }, (f.category || '') + (f.location ? ' · ' + f.location : '')),
            h('h2', null, f.title || 'Untitled film'),
            h('p', { className: 'muted' }, f.couple || ''),
            h('div', { className: 'row' },
              id ? h('span', { className: 'tag ok' }, 'YouTube linked') : h('span', { className: 'tag warn' }, 'No YouTube link — shows “coming soon”'),
              f.cover ? qualityTag(f.quality) : null)));
      })) : empty('No films yet — click “Add Film” on the left.'));
  }

  function PhotosPreview(props) {
    var items = data(props.entry).items || [];
    return section('Photography', items.length + (items.length === 1 ? ' photo' : ' photos') + ' in the gallery',
      items.length ? h('div', { className: 'masonry' }, items.map(function (p, i) {
        return h('figure', { key: i },
          p.image ? h('img', { src: img(props, p.image), alt: p.caption || '' }) : h('div', { className: 'placeholder' }, 'No image'),
          h('figcaption', null,
            h('span', null, p.caption || 'No caption', p.couple ? h('em', null, ' · ' + p.couple) : null),
            qualityTag(p.quality)));
      })) : empty('No photos yet — click “Add Photo” on the left.'));
  }

  function SettingsPreview(props) {
    var d = data(props.entry);
    var services = d.services && d.services.length ? d.services : [];
    var hero = img(props, d.heroImage);
    return h('div', null,
      h('div', { className: 'hero', style: hero ? { backgroundImage: 'linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.75)),url("' + hero + '")' } : {} },
        h('p', { className: 'eyebrow light' }, 'Wedding films & photography'),
        h('h1', null, d.tagline || 'Capturing Timeless Love Stories'),
        h('p', null, d.heroSubtitle || ''),
        h('span', { className: 'btn' }, 'Check your date'),
        d.heroYoutube ? h('span', { className: 'tag ok floating' }, 'Background reel on') : null),
      h('div', { className: 'wrap' },
        h('p', { className: 'eyebrow' }, 'What we cover'),
        h('h1', { className: 'title' }, d.servicesTitle || 'Every chapter, beautifully told'),
        services.length ? h('ol', { className: 'services' }, services.map(function (s, i) {
          return h('li', { key: i }, h('span', null, String(i + 1).padStart(2, '0')), h('strong', null, s.title), h('small', null, s.text || ''));
        })) : empty('Using the default six events (Nikkah, Mehndi, Baraat, Walima, Destination, Pre-wedding). Add your own under “What we cover — events”.'),
        h('div', { className: 'about' },
          d.aboutImage ? h('img', { src: img(props, d.aboutImage), alt: '' }) : null,
          h('div', null,
            h('p', { className: 'eyebrow' }, 'The story'),
            h('h2', null, d.aboutTitle || ''),
            (d.aboutText || '').split(/\n\s*\n/).map(function (p, i) { return h('p', { key: i, className: 'muted' }, p); }))),
        h('div', { className: 'contact' },
          h('p', null, h('strong', null, 'WhatsApp: '), d.whatsapp || '—', /^9230{8,}$/.test(d.whatsapp || '') ? h('span', { className: 'tag warn' }, 'Placeholder — add your real number') : null),
          h('p', null, h('strong', null, 'Email: '), d.email || '—'),
          h('p', null, h('strong', null, 'Image quality default: '), QUALITY[d.imageQuality] || 'Balanced 82%'))));
  }

  function PackagesPreview(props) {
    var d = data(props.entry);
    var items = d.items || [];
    return section('Investment', 'Collections',
      h('div', null,
        h('div', { className: 'grid three' }, items.map(function (p, i) {
          return h('article', { key: i, className: 'pkg' + (p.featured ? ' dark' : '') },
            p.featured ? h('span', { className: 'badge' }, 'Most loved') : null,
            h('p', { className: 'meta' }, p.tagline || ''),
            h('h2', null, p.name || ''),
            h('p', { className: 'price' }, h('small', null, 'from ' + (d.currency || 'PKR') + ' '), p.price || ''),
            h('ul', null, (p.includes || []).map(function (x, j) { return h('li', { key: j }, x); })));
        })),
        d.note ? h('p', { className: 'muted note' }, d.note) : null));
  }

  function TestimonialsPreview(props) {
    var items = data(props.entry).items || [];
    return section('Kind words', items.length + ' reviews',
      h('div', { className: 'quotes' }, items.map(function (t, i) {
        return h('blockquote', { key: i }, h('p', null, '“' + (t.quote || '') + '”'), h('cite', null, t.name || '', t.event ? h('small', null, ' · ' + t.event) : null));
      })));
  }

  CMS.registerPreviewTemplate('films', FilmsPreview);
  CMS.registerPreviewTemplate('photos', PhotosPreview);
  CMS.registerPreviewTemplate('settings', SettingsPreview);
  CMS.registerPreviewTemplate('packages', PackagesPreview);
  CMS.registerPreviewTemplate('testimonials', TestimonialsPreview);
  CMS.registerPreviewStyle('/admin/preview.css');

  // ---------- header shortcuts (live site, inquiries, credits) ----------
  var SHORTCUTS = [
    { label: 'Customer inquiries', href: 'https://app.netlify.com/projects/filmsbyusamaweb/forms' },
    { label: 'Netlify credits', href: 'https://app.netlify.com/teams/filmsbyusama/billing/usage' },
    { label: 'View website', href: 'https://filmsbyusama.com' },
  ];
  function addShortcuts() {
    var header = document.querySelector('#nc-root [class*="-AppHeaderContent"]');
    if (!header || header.querySelector('.fbu-shortcuts')) return;
    var actions = header.querySelector('[class*="-AppHeaderActions"]');
    var bar = document.createElement('nav');
    bar.className = 'fbu-shortcuts';
    SHORTCUTS.forEach(function (s) {
      var a = document.createElement('a');
      a.href = s.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = s.label;
      bar.appendChild(a);
    });
    if (actions) header.insertBefore(bar, actions); else header.appendChild(bar);
  }
  new MutationObserver(addShortcuts).observe(document.documentElement, { childList: true, subtree: true });

  // index.html sets CMS_MANUAL_INIT, so start the CMS now that everything is registered
  if (window.CMS_MANUAL_INIT && typeof CMS.init === 'function') CMS.init();
})();
