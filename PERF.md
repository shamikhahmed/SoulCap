# SoulCap — Performance budgets

**Version:** 8.0.2 · Measured **2026-07-30** against local `http://127.0.0.1:8788/?demo=1`  
(Chromium · iPhone viewport 430×932 · Playwright/Chromium)

Offline-first PWA: no framework bundle, no CDN fonts. Critical path = HTML + CSS + `data.js` + `app.js` (+ optional vendor after first technique).

---

## Budgets (hard)

| Metric | Budget | Live (this session) | Status |
|--------|--------|---------------------|--------|
| First Contentful Paint | ≤ 1500 ms | **188 ms** | Pass |
| `domContentLoaded` (nav timing) | ≤ 2000 ms | **233 ms** | Pass |
| Tab switch (Now → Calm) | ≤ 500 ms | **129 ms** | Pass |
| Critical asset bytes (app.js+css+data+index+sw+vendor) | ≤ 900 KB | **~621 KB** | Pass |
| `app.js` alone | ≤ 450 KB | **308 KB** | Pass |
| External hosts after load | **0** | **0** (`127.0.0.1` only) | Pass |
| Offline reload (SW / cache) | must boot UI | **true** | Pass |
| JS heap (after demo boot) | ≤ 40 MB | **~10 MB** | Pass |

Splash: CSS animation only; no artificial JS delay. Reduced-motion / Still shorten splash (see `app.css`).

---

## Asset sizes (uncompressed transfer, local)

| File | KB |
|------|-----|
| `app.js` | 308 |
| `data.js` | 128 |
| `app.css` | 95 |
| `vendor/gsap.min.js` | 71 |
| `vendor/breath-orb.js` | 5 |
| `index.html` | 12 |
| `sw.js` | 2 |
| **Sum** | **~621** |

`docs/` tree on disk ~277 MB — dominated by `screenshots/gallery/` PNGs (**not** in SW precache; not on critical path).

---

## Optimizations already in place

- No framework; single ES5 IIFE.
- GSAP lazy-loaded for breath sessions only.
- SW: navigate network-first, assets cache-first; activate deletes old CACHE.
- Images: journal photos downscaled on-device before `localStorage`.

---

## Before / after (this audit pass)

| Change | Perf impact |
|--------|-------------|
| Splash `background: var(--splash-bg)` | Negligible (token alias). |
| Budget e2e gate | Catches regression; no runtime cost. |

No measurable regression expected vs 8.0.1.

---

## Enforcement

`e2e/app.spec.ts` describe **Phase audit budgets** — fails if critical assets exceed ceilings or any non-origin request is observed after load.
