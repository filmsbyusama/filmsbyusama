# filmsbyusama — Wedding Films & Photography

React + Vite + Tailwind + Framer Motion site with a free Decap CMS admin at `/admin`, built for zero-cost hosting on Netlify.

```
filmsbyusama/
├─ index.html                 ← theme pre-load script, Netlify Identity widget, hidden Netlify Form
├─ netlify.toml               ← build settings, SPA redirect, cache headers
├─ tailwind.config.js         ← light/dark tokens, Queensides font family, animations
├─ public/
│  ├─ _redirects              ← /*  /index.html  200
│  ├─ admin/                  ← Decap CMS dashboard (index.html + config.yml)
│  ├─ content/*.json          ← ALL editable content (films, photos, packages, reviews, settings)
│  ├─ fonts/                  ← drop Queensides.woff2 here (see fonts/README.txt)
│  └─ uploads/                ← images uploaded through the admin
└─ src/
   ├─ App.jsx, main.jsx, index.css (@font-face + theme variables)
   ├─ lib/                    ← content loader, theme hook, YouTube URL parser
   └─ components/             ← Navbar, Hero, Films, VideoModal, Photography, Lightbox,
                                About, Packages, Testimonials, Contact, Footer, motion helpers
```

---

## Deploy on Netlify for free (≈5 minutes)

You need a free **GitHub** account and a free **Netlify** account.

**1. Put the code on GitHub (1 min)**
- Go to github.com → **New repository** → name it `filmsbyusama` → **Create**.
- Click **uploading an existing file**, drag in *everything inside* this folder (not `node_modules` / `dist`), then **Commit changes**.
  (Or from a terminal: `git init && git add . && git commit -m "init" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`.)

**2. Create the site on Netlify (1 min)**
- app.netlify.com → **Add new project → Import an existing project → GitHub** → pick `filmsbyusama`.
- Netlify reads `netlify.toml` automatically (build `npm run build`, publish `dist`). Click **Deploy**.
- Optional: **Project configuration → Change project name** → `filmsbyusama` → your site is `https://filmsbyusama.netlify.app`.

**3. Turn on the free admin login (2 min)**
- **Project configuration → Identity → Enable Identity.**
- Under **Registration**, set to **Invite only** (so strangers can't sign up).
- Under **Services → Git Gateway**, click **Enable Git Gateway**.
- **Identity → Invite users** → enter your email. Open the invite email, click the link, set a password.

**4. Log in**
- Visit `https://YOUR-SITE.netlify.app/admin/` (or the tiny "Studio" link in the footer) and log in.
- Edit Films / Photography / Packages / Testimonials / Site Settings → **Publish**.
  Every publish commits to GitHub and Netlify rebuilds — changes are live in about a minute.

**5. Contact form emails**
- After the first deploy: **Forms** → enable form detection if asked → the `inquiry` form appears.
- **Forms → Form notifications → Add notification → Email** to get every inquiry in your inbox. (Redeploy once after enabling detection.)

**6. Finishing touches**
- In `public/admin/config.yml`, set `site_url` / `display_url` to your real URL.
- If your GitHub branch is `master`, change `branch: main` in the same file.
- Custom domain: **Domain management → Add a domain** (free HTTPS included).

---

## Adding your content

| What | Where in /admin | Notes |
|---|---|---|
| Wedding films | 🎬 Films | Paste any YouTube link (`watch?v=`, `youtu.be/`, `shorts/`, `embed/`) or just the ID. Leave the cover empty to use the YouTube thumbnail. Toggle **Featured** for a large card shown first. |
| Hero reel | ⚙️ Site Settings → Hero background reel | Plays muted & looped behind the headline. Empty = hero photo with slow zoom. |
| Photos | 📷 Photography | Upload or paste URLs. Drag to reorder. |
| Prices & FAQs | 💍 Packages | Prices are text, so "On request" works too. |
| WhatsApp / email / socials | ⚙️ Site Settings | WhatsApp number: country code + digits, e.g. `923001234567`. |

**The sample content is placeholder** — names, quotes, stats, prices and the email/WhatsApp number are examples to replace. Sample images come from Unsplash.

---

## Queensides font

Queensides isn't on Google Fonts, so it's self-hosted. Put `Queensides.woff2` (or `.ttf`) in `public/fonts/` — see `public/fonts/README.txt`. Check the licence covers commercial use. Until then the site falls back to Cormorant Garamond.

The `@font-face` rules live at the top of `src/index.css`; the Tailwind family is `font-queensides` (also set as the default `sans` and `serif`).

---

## Run locally

```bash
npm install
npm run dev          # site → http://localhost:5173
npm run cms          # (second terminal) lets /admin/index.html edit local files without logging in
npm run build        # production build into dist/
```

## Customising the look

- Colours: `:root` and `.dark` in `src/index.css` (RGB triplets) → used as `bg`, `ink`, `gold`, `muted`, `surface` in Tailwind.
- Theme choice is saved in `localStorage` (`fbu-theme`) and defaults to the visitor's system setting.
- Motion respects the visitor's "reduce motion" setting.
