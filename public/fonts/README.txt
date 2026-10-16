QUEENSIDES FONT — PUT YOUR FONT FILES HERE
===========================================

Queensides is not on Google Fonts, so it is self-hosted from this folder.

1. Download Queensides (it is distributed on sites like DaFont / FontSpace;
   check the license — many free versions are "personal use only", so buy or
   confirm a commercial licence for a business website).

2. Rename the files and drop them in this folder:

     Queensides.woff2          <- regular (required; .ttf also works)
     Queensides-Light.woff2    <- optional
     Queensides-Medium.woff2   <- optional

   No .woff2? Convert a .ttf for free at https://transfonter.org
   (or just use Queensides.ttf — it is already listed in src/index.css).

3. Commit + push. Netlify rebuilds and the whole site switches to Queensides.

Until the file is here, the site falls back to Cormorant Garamond
(an elegant Google font), so nothing looks broken in the meantime.
