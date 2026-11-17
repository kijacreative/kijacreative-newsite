# Third-party notices

## Infinite Gallery — src/widgets/work-explorer.js
Ported from https://github.com/dososo/infinite-image-gallery (world/camera
architecture, R2 lattice scatter, rectangle separation, Fibonacci sphere,
CRT power-off). The photographs from that repo are **not** used.

```
MIT License

Copyright (c) 2026 爆裂队长NEXT / BLCaptain (@dososo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Motion Primitives — src/motion.js
Spring maths and behaviour ported from MagneticButton, SpotlightCard,
TiltCard, NumberTicker and MouseParallax in
https://github.com/itsjwill/motion-primitives-website (MIT).

## Motion 14.9.0 — src/vendor/motion-scroll.min.js
https://github.com/motiondivision/motion — MIT License, Copyright (c) 2018 Framer B.V.
A tree-shaken subset (18 KB, 7 KB gzipped): `animate` from motion/mini, plus
`scroll` and `inView`. Used only on the homepage, for the scroll-linked effects
(reel parallax, "Good taste" words, the alignment circles, the review badge),
which run on native scroll timelines where the browser supports them. The
full package (179 KB) is deliberately not shipped. To rebuild:

    npm i motion@14.9.0 esbuild
    echo "export { animate } from 'motion/mini'; export { scroll, inView } from 'motion';" > m.js
    npx esbuild m.js --bundle --minify --format=iife --global-name=Motion --target=es2019 --legal-comments=inline --outfile=src/vendor/motion-scroll.min.js

## GSAP 3.15.0 — src/vendor/gsap.min.js
Not MIT. GreenSock "Standard no-charge license"
(https://gsap.com/standard-license): free, including commercial use.
Loaded only when the /work explorer opens. Keep the header comment intact.

## League Gothic, Lato — src/fonts/
SIL Open Font License 1.1 (via @fontsource).

## Truus.co rebuild — interaction reference only, nothing shipped
https://github.com/Thakuma07/Truus.co-Awwward-Website has **no licence** and is
a recreation of a real agency's site, so none of its code, artwork, stickers,
fonts, video or layout is used. Option B (/b, src/pages/home-b.js,
src/widgets/home-b.js) reimplements general interaction patterns — pinned
horizontal scroll, fling cards, spreading card fan, cursor label, proximity
push, scribble page transition — from scratch, with marks and stickers drawn
for Kija.
