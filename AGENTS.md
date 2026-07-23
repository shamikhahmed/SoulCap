# SoulCap — build guide for AI agents & developers

Read this first. It tells you what SoulCap is, the rules you must never break, how the code is
laid out, the exact conventions to write in, and the workflow to ship a change. If you follow it,
your changes will look like they were written by the same hand as the rest of the app.

Companion docs: `ROADMAP.md` (what to build next) · **`SPEC-v3.1-screen-layouts.md`** (THE CURRENT
ASSIGNMENT — kill the uniform card stack; bento hierarchy, rails, data-viz heroes, full-bleed) · **`SPEC-v3.0-redesign.md`** (Amethyst redesign —
**shipped through 3.0.1**; keep as design reference) · `SPEC-v2.3-regulation-depth.md` (next build
wave) · `SPEC-v2.2-approach-packs.md` (packs shipped in 3.0.1; lens/wizard still later) ·
`SPEC-v2.1-guided-path.md` / `SPEC-v2.0-premium-polish.md` /
`SPEC-v1.9-clinical-library.md` (shipped, reference) ·
`ARCHITECTURE.md` · `DATA_MODEL.md` · `PRIVACY.md` · `ACCESSIBILITY.md` · `EVALUATION.md` ·
`SAFETY.md` (truth inventory) · `CHANGELOG.md` · `HANDOVER.md` (history). Planning notes live
outside the repo in the owner's vault (`~/Capricorn-Brain/AI/Claude-Code/SoulCap-*.md`,
`~/Capricorn-Brain/AI/Cursor/SoulCap-Guided-Path.md`).

---

## 1. What SoulCap is (and is not)

**Is:** a calm, private, offline-first PWA that teaches evidence-informed self-regulation skills,
holds a personal journal, maps the people around you (the "Constellation"), and gently adapts to
what the user tells it. A **personalised emotional operating system**.

**Is NOT:** an AI therapist, a diagnosis tool, a mood tracker with fake AI, or a crisis service.

The one-line philosophy that settles arguments:

> Don't build an app that "fixes the user." Build one that helps them understand themselves,
> regulate emotions, build habits, and recognise when to seek professional help.

Success = the user needs the app **less** over time. Never optimise for time-in-app.

---

## 2. Hard rules — do not break these

**Product / safety**
- Never claim it is therapy, treats, cures, diagnoses, or replaces professional care.
- Never render a technique as clinically reviewed — none are yet. The Techniques screen shows a
  "not yet clinically reviewed" banner; keep it until a licensed clinician signs off.
- **No crisis phone numbers, no country/region selection** (owner decision). The help screen gives
  gentle, number-free, country-agnostic guidance only. Do not re-add specific lines.
- Crisis/help flows are **hard-coded text**, never generated, never model-driven.
- The app **never contacts anyone**. "Message someone" opens the user's own messaging app (`sms:`).
- Trauma-aware: if the user records trauma in "Your story", potentially-activating techniques
  (`traumaCaution: true`) stay out of auto-suggestions (still browsable, with a gentle caution).
- Spoken guidance starts **silent around people** (panic screen, and exercises launched after the
  user picks "around people" in Calm). One-tap speaker toggle to enable.
- Age floor 18+. Under-18 is declined gently and pointed elsewhere — never enters the app.

**Privacy**
- Everything is `localStorage`. **Zero network requests after load.** No account, no server, no
  analytics, no LLM, no external fonts/CDNs. Do not add any `fetch`, `XMLHttpRequest`, `<script src>`
  to a CDN, or web-font link. If a feature needs the network, it does not ship here.
- Photos are down-scaled on-device (canvas, ~1000px JPEG) before storing.

**Design (see `docs/app.css` tokens)**
- No streaks, points, badges, leaderboards, guilt notifications, red badge counts, infinite scroll,
  fake typing indicators, confetti on emotional content, or "I care about you" copy.
- One filled (accent) button per screen; everything else outlined/plain.
- Motion is ease-out, no overshoot; honour `prefers-reduced-motion`.
- Body copy stays 15px or larger. Compact iPhone chrome and metadata may use 9–14.5px when
  contrast is strong and browser zoom remains enabled. Tap areas stay at least 48px.
  Serif (`--voice`) = the app speaking; sans (`--ui`) = chrome/labels.
- Purple accent, matched to the logo (`--accent`). Low chroma, warm neutrals.
- Emoji are allowed **as user content** (journal moods/stickers) but never as UI section markers.

---

## 3. Architecture

No framework, no build step, no dependencies in the shipped app. The product is four files in
`docs/`, served statically by GitHub Pages.

```
docs/
  index.html   Static shell: splash, view <section>s, tab bar, dialogs (panic, runner,
               journal editor, sheet), the floating Help button. Loads data.js then app.js.
  app.css      Design System v2. CSS custom properties define light/dark/night themes.
               Style through tokens; never hardcode colours in components.
  data.js      Content only (global consts): SKILLS, DOMAIN_META, FAMILY_META, NEEDS_META,
               CALM_NEEDS, CONCERNS, RELATIONSHIP_TYPES, SAFETY_PLAN_STEPS, HISTORY_SECTIONS,
               JOURNAL_PROMPTS, COVER_COLORS, JOURNAL_STICKERS.
  app.js       All logic, one IIFE. State, safety kernel, render/router, runner, journal,
               constellation, settings.
  sw.js        Service worker. Precaches assets for offline. Bump CACHE on every asset change.
  manifest.json, icons/  PWA install metadata + brand marks.
```

Other top-level dirs are **not** the shipped product:
- `backend/` — NestJS lab (builds clean, 0 TS errors, **not deployed**, PWA does not call it).
  `backend/_legacy/` holds a quarantined duplicate AI stack + dead JWT auth — don't revive it.
- `mobile/` — Expo lab source only.
- `e2e/` — Playwright tests. `.github/workflows/deploy.yml` — CI that gates the Pages deploy.

### State
Single object persisted to `localStorage['soulcap_v1']`. Shape lives in `DEFAULT` in `app.js`
(currently `v: 12`). `load()` merges saved state over `DEFAULT` and back-fills nested objects, so
**adding a new top-level field is safe** — add it to `DEFAULT`, old users get the default. If you
change the *meaning* of existing data, bump `DEFAULT.v` and migrate in `load()`.
Theme is mirrored to `localStorage['soulcap_theme']` for the pre-paint script in `index.html`.

### Views & router
Tabs: `now · calm · journal · map · me`. `render()` clears the active `#view-*` and rebuilds it
with the `el()` DOM builder, then marks the tab selected. `selectTab(t)` switches + scrolls to top.
**`reRender()`** re-renders in place *keeping scroll position* — use it for in-view toggles
(theme, settings) so the page doesn't jump to the top.

### Safety kernel (the most important code)
`assessRisk(text)` in `app.js` returns tier 0–3 from keyword lists (`CRISIS_HARD`,
`CRISIS_CONTEXTUAL` + `DISTRESS_CONTEXT`, `ELEVATED`). Tier 3 is terminal.
**These lists are duplicated in `backend/src/ai/safety/safety-gate.service.ts` — keep the two in
sync by hand.** Inflected forms matter (`ending my life` is not a substring of `end my life`).

---

## 4. Code conventions (write exactly like this)

- **Plain ES5 style**: `var`, `function`, no arrow functions, no `let/const`, no classes, no
  optional chaining, no template literals in new code (match the file). It must run with no
  transpile on old mobile browsers.
- Build DOM with the **`el(tag, attrs, kids)`** helper — never `innerHTML` for anything with user
  data. `attrs`: `class`, `text`, `html` (trusted only), `onX` events, or plain attributes.
  `$(sel)` = querySelector, `clear(node)` empties a node.
- All state changes call **`save()`** then **`render()`** (or `reRender()` to keep scroll).
- Content (any user-visible copy, technique data, option lists) goes in **`data.js`**, not `app.js`.
- Colours/spacing/type come from **CSS tokens** in `app.css`. If you need a new semantic colour,
  add a token in all three theme blocks (light default, dark `@media` + `[data-theme="dark"]`,
  night `[data-theme="night"]`).
- Copy voice: plain, warm, tentative ("Some people find…", not "You are…"). No jargon without a
  gloss. Errors are calm and blameless.
- Comment the *why*, briefly, where a choice is non-obvious (see existing comments for tone).

---

## 5. Recipes

**Add a technique** → append an object to `SKILLS` in `data.js`. Required fields: `id, name,
domain, family, mins, capacity ('low'|'medium'|'any'), needs ('none'|'water'|'cold'|'sour'|
'space'|'quiet'), discreet (bool), indication[], contraindication[], mechanism (why it works, one
sentence), blurb, steps[], source`. Optional: `pattern` (paced-breathing phases — see box-breathing)
makes it an Apple-Watch-style session; `traumaCaution: true` keeps it out of auto-suggestions for
users who noted trauma. New `family` → also add to `FAMILY_META`; new `domain` → add to
`DOMAIN_META` with a `--domain-colour` token.

**Add a setting** → add UI in `renderMe()` under the right `settingsGroup(...)`, using
`toggleBtn(...)` or `settingChips(...)`. Persist a field on `DEFAULT`. Use `reRender()` in handlers.

**Add a screen/section** → add a `#view-x` `<section>` in `index.html`, add `x` to the `VIEWS`
array + the `render()` switch + a tab button (only if it earns a tab — five is the cap). Give it a
Help affordance (`help-btn` or rely on the floating `#fab`).

**Add a test** → put it in `e2e/app.spec.ts` (features) or `e2e/safety.spec.ts` (safety-critical).
Use `seedDemo(page)` (state via `?demo=1`, splash dismissed) or `freshThrough(page)` (fresh
onboarding). Expose internals for tests via `window.__soulcap` if needed. Safety-critical
behaviour **must** have a test — it gates the deploy.

---

## 6. Ship workflow (follow every time)

1. Make the change in `docs/` (and mirror any safety-keyword change into the backend service).
2. If you touched any file in `docs/`, **bump the cache**: `CACHE` in `docs/sw.js`
   (`soulcap-vNNN`), `swCache` + `version` in `VERSION.json`, and `APP_VERSION`/`version` in
   `app.js`. All three must match. Stale cache = users stuck on the old build.
3. Update `CHANGELOG.md` (keep-a-changelog style) and bump the version in `SAFETY.md` + `HANDOVER.md`.
4. Run the tests locally: `npm run verify` (or `npx playwright test`). Chromium only, two projects
   (mobile + desktop). **All green before you push.**
5. Commit (clear message, `Co-Authored-By` if an agent), push to `main`.
6. CI (`.github/workflows/deploy.yml`) runs `npm run verify`; if green it deploys `docs/` to
   GitHub Pages. Confirm live at `https://shamikhahmed.github.io/SoulCap/` and that the served
   `sw.js` shows the new `CACHE`.

Local preview: `npm run dev` (python http.server on 8788) then open `/?demo=1`. To see a code
change after the SW cached the old build, unregister SW + clear caches in DevTools, or bump CACHE.

---

## 7. Definition of done (ask these of every change)

Does it reduce stress? Is it calming, simple, honest about limits? Is it private (no network)?
Could it overwhelm someone mid-panic? Is it accessible (contrast both themes, ≥48px targets,
reduced-motion, readable body copy, zoomable compact labels)? Does the safety behaviour have a
test? Would Apple ship this?
If any answer is no, it's not done.
