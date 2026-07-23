# SPEC v5.0 — Native feel, motion & signature moments (build guide for Cursor)

> **Goal: the app must feel like a native 2026 product, not a 1996 web page.** Fluid, physical,
> alive — while staying calm, private and honest. Build with `SPEC-v4.0-master-design.md` (structure,
> screens, copy) — this spec adds the **motion, depth and interaction layer** on top.

**Owner decisions locked (2026-07-24):**
1. **Libraries:** self-hosted **GSAP core** + a hand-written **WebGL shader**. **No Three.js.**
2. **Motion scope:** signature moments + fluid navigation (not expressive everywhere).
3. **Adaptation:** a user-chosen **expressiveness preset**. **No age-based styling.**
4. **Performance:** **flagship-first ceiling**, with automatic graceful degradation.

---

## 0. Dependency rule change (this supersedes `AGENTS.md §2` "no dependencies")

Self-hosted libraries are now permitted, under strict conditions:
- Vendored into **`docs/vendor/`** and committed to the repo. They deploy with the app via GitHub
  Pages. **No CDN, no external fetch, no third-party call — ever.** The zero-network promise stands.
- Allowed: **GSAP core** (~70KB; free for commercial use since Apr 2025, incl. plugins) and our own
  WebGL/GLSL (~10KB). **Not allowed:** Three.js, any analytics, any font CDN, anything phoning home.
- Must work under the existing ES5 style (use GSAP's UMD build; keep our code `var`/`function`).
- Update `AGENTS.md` and `.cursorrules` to reflect this exception precisely — no wider licence.

**Budget: ≤120KB gzipped added, total.** If a feature can be done in CSS/Web Animations at similar
quality, do that instead.

---

## 1. What actually makes it feel native (priority order)

1. **View Transitions API** (0 KB, built into the browser) — shared-element morphs: a technique card
   *becomes* the runner; a journal entry *becomes* the page; a person *becomes* their sheet. This is
   the single biggest native-feel win. Use it as the default for every push/pop.
2. **Gesture navigation** — swipe left/right between tabs, drag-to-dismiss sheets and full-screen
   flows (with rubber-banding), swipe-back on pushed subviews. Gestures must always have a visible
   control equivalent.
3. **Spring physics** — GSAP-driven, mass/tension feel rather than linear easing, on press, sheets,
   and card entrances. Never bouncy or comedic; think iOS, not a toy.
4. **Haptics bound to motion** — a light tick on selection, a softer cue on completion, breathing
   pulses on the pacer. Silent by default around people (existing rule).
5. **Depth** — layered parallax on hero bands, glass/blur over the Constellation, ~3% grain, dynamic
   gradients that drift very slowly.
6. **The signature 3D moment** (§3).

---

## 2. Signature moments (the only places we go big)

Exactly these. Everywhere else is fluid but quiet.
- **Splash** — the mark draws/breathes once on a living gradient, then morphs into the Now header.
- **The breathing orb** (§3) — the app's icon of itself. Used in Runner + Panic pacer.
- **Check-in** — chips settle with spring; the chosen word ripples subtly into the hero band's hue.
- **Guided Path result** — the recommended approach card arrives with a considered reveal (not a
  slam): gradient bloom + the "why" typing in gently.
- **Journal open** — the book cover opens into the page (shared-element + slight 3D rotate).
- **Constellation** — already orbiting; add depth-of-field and a gentle parallax on drag.
- **Week/progress viz** — draws in once when it enters view (GSAP), never on every render.

---

## 3. The breathing orb (hand-written WebGL, ~10KB)

The one true 3D element. A soft, volumetric, slowly-churning sphere of light:
- Fragment-shader sphere with fresnel rim, internal noise flow, and a gentle colour drift derived
  from `--accent` (so it matches every theme, including Ocean/Forest/AMOLED).
- **Drives the breath**: scale + luminosity follow the actual inhale/hold/exhale timing so the user
  can breathe with the light rather than read a countdown.
- Runs on a `<canvas>` sized to DPR, capped at 60fps, paused when off-screen or backgrounded.
- **Fallback ladder:** no WebGL / weak device / reduced-motion / `Still` preset → the existing CSS
  orb, unchanged. The exercise must work identically without the shader.

---

## 4. Expressiveness presets (replaces age-based adaptation)

Three levels, user-chosen at onboarding ("How much movement feels right?"), changeable anytime in
Settings, and honestly explained.

| Preset | Motion | 3D orb | Gradients | Haptics |
|---|---|---|---|---|
| **Vivid** | Full signature moments, parallax, gestures | On | Drifting | Full |
| **Balanced** (default) | Transitions + light springs; signature moments simplified | On | Subtle | Light |
| **Still** | Opacity/position only, ≤90ms | Off (CSS orb) | Static | Off |

- `prefers-reduced-motion: reduce` **forces Still** and disables the override (accessibility wins).
- Preset is a token-level switch (`data-motion="vivid|balanced|still"`), read by CSS and JS, so a
  single attribute changes the whole app.
- **No birth-year styling.** We already gate 18+; taste and device vary far more than age.

---

## 5. Performance: flagship ceiling, graceful floor

- **Target:** 60fps on a recent iPhone/Pixel with everything on. That's the design ceiling.
- **Degrade automatically, never break.** Capability probe at boot (WebGL support, `deviceMemory`,
  `hardwareConcurrency`, a short frame-timing sample). On weak devices: drop the shader, reduce
  parallax, shorten durations — silently, no message, and **default them to Balanced/Still**.
- Rules: animate only `transform`/`opacity`; no layout thrash; `content-visibility` for offscreen
  rails; pause all loops when the tab is hidden; never animate during the Panic pacer beyond the orb.
- **Cold start must stay fast** — lazy-load GSAP and the shader *after* first paint; the app must be
  usable before they arrive.

---

## 6. Safety and calm (unchanged, and they win every conflict)

- **Panic / Help stays the plainest surface in the app, forever.** Ambient orb + type only. No
  parallax, no gestures that could mis-fire, no 3D beyond the pacer, no delay to reaching Help.
- Motion must never delay a safety action or obscure a red-flag panel.
- Nothing celebratory on emotional content. No confetti, ever.
- All existing safety rules (tier-3 Help, no diagnosis, no crisis numbers, banners) unchanged.

---

## 7. Build sequence (each PR shippable, green, cache bumped)

1. **PR-1 Motion foundation** — vendor GSAP (`docs/vendor/`), motion tokens, `data-motion` presets,
   capability probe + degradation, haptics helper. Update `AGENTS.md`/`.cursorrules` dependency rule.
2. **PR-2 View Transitions + router** — shared-element morphs on every push/pop (pairs with v4.0 PR-2).
3. **PR-3 Gestures** — swipe tabs, drag-to-dismiss sheets/flows, swipe-back, rubber-banding.
4. **PR-4 Breathing orb shader** — WebGL orb + full fallback ladder; wire to Runner + Panic pacer.
5. **PR-5 Signature moments** — splash, check-in ripple, path result reveal, journal open, viz draw-in.
6. **PR-6 Depth pass** — parallax hero bands, glass over Constellation, grain, drifting gradients.
7. **PR-7 Onboarding preset pick** + Settings entry + copy.
8. **PR-8 Performance + a11y sweep** — profile on a mid device, verify Still parity, contrast over
   gradients, reduced-motion, regenerate the gallery.

---

## 8. Definition of done
Hand someone the app cold on a modern phone. It should feel **built for this year and for this
device** — things move like objects, screens flow into each other, the orb breathes with them — and
it should still feel **calm**. On a weak phone or with reduced motion, it quietly becomes simpler and
loses nothing that matters. The Panic screen is still the plainest thing in it.

---

## 9. EXECUTION PROTOCOL — run this as a loop until everything is done

**Do not stop after one PR.** For each PR in §7, in order:

1. Implement it fully — real code, no stubs, no TODOs left behind.
2. `npm run verify` — all Playwright checks green (mobile + desktop). Fix until green.
3. Bump **all three** together: `CACHE` in `docs/sw.js`, `version`+`swCache` in `VERSION.json`,
   `APP_VERSION`+`version` in `docs/app.js`.
4. Update **every** doc that the change touches: `CHANGELOG.md`, `SAFETY.md`, `HANDOVER.md`,
   `ROADMAP.md` (mark progress), `AGENTS.md` / `.cursorrules` (only for the PR-1 dependency rule),
   `ARCHITECTURE.md` / `DATA_MODEL.md` / `ACCESSIBILITY.md` if affected.
5. Regenerate the screen gallery: `npm run gallery` → commit the updated
   `docs/screenshots/gallery/*` and `gallery-manifest.json` and `screen-gallery.html`.
6. **Commit and push to `main`.** Confirm CI is green and the live `sw.js` serves the new cache.
7. Move to the next PR. Repeat until all of §7 is shipped.

**Finish condition:** all 8 PRs shipped, suite reliably green, gallery regenerated and committed,
every doc current, everything pushed, live site serving the final cache. Then post a summary of what
shipped, what degraded on weak devices, and anything you deliberately left out.
