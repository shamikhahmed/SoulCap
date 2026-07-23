# SoulCap Architecture

**Version:** 1.9.3 · **Product boundary:** `docs/` · **SW:** `soulcap-v193` · **Schema:** v11

## System shape

SoulCap is a static, offline-first PWA with no runtime dependency graph and no build step.

```text
GitHub Pages
  └─ docs/
      ├─ index.html  static shell and dialogs
      ├─ data.js     user-visible content and deterministic catalogues
      ├─ app.js      state, routing, safety, ranking, patterns, rendering
      ├─ app.css     theme-aware design system (motion + spacing tokens)
      └─ sw.js       same-origin precache and offline shell

Browser
  ├─ localStorage['soulcap_v1']              canonical user state (v10)
  ├─ localStorage['soulcap_theme']           pre-paint theme mirror
  ├─ localStorage['soulcap_appearance']      pre-paint display mirror
  ├─ localStorage['soulcap_locale']          en | rui
  └─ localStorage['soulcap_notice_clinical'] clinical-English notice dismiss
```

`backend/` and `mobile/` are isolated labs. The shipped PWA does not import them, call them, or
depend on their availability.

## Runtime flow

1. `index.html` applies validated theme, appearance, and locale (`dir` always `ltr`) before CSS.
2. `app.js` loads `soulcap_v1`, runs sequential migrations through v10, and merges nested defaults.
3. `render()` rebuilds the active view with `el()`; user content uses `textContent`, not `innerHTML`.
4. Preference and content writes attempt `save()` first; failures roll back in-memory state and
   show a calm notice. Settings toggles often use `reRender()` to keep scroll.
5. The service worker precaches the complete shell and never fetches third-party assets.

## Personalisation model

Deterministic and inspectable:

- explicit arrival word and direct need carry the strongest recommendation weight;
- declared concerns and history add bounded context;
- previous helpful feedback adds a small weight;
- ambient time is weaker than explicit intent;
- recent exercises are down-ranked;
- journal text is never mined for recommendations or patterns;
- trauma caution removes `traumaCaution` techniques from automatic suggestions.

Pattern cards require ≥5 distinct check-in days before analysis and ≥3 supporting days before
surfacing, with Low/Medium/High confidence labels. Confirm / reject / hide / global off persist
locally. Correlation is never described as cause or diagnosis.

Library articles are static in `data.js` (optional bookmarks). Daily supports store selected IDs
and local-day completion only — no streaks or ranking feed.

## Safety boundary

The keyword kernel in `docs/app.js` is the only runtime risk assessor. Lists mirror
`backend/src/ai/safety/safety-gate.service.ts` (keep in sync by hand; includes `kms`). Help content
is hard-coded, number-free, and country-agnostic.

Tier-3 wording opens Help on: check-in feeling, journal save, Your story, safety plan, Thought
Parking save, constellation notes, Personal Manual lines, Principles, and reflection notes.
Content still saves when storage allows. Panic instructional bodies stay hard-coded English.

## Locale

`en` (default) and `rui` (Roman Urdu, Latin script, LTR). Chrome strings resolve via `t()` /
`tUi()` with rui→en→key fallback. Clinical, safety, technique, and library article bodies remain
English until a native clinical-copy review.

## Change rules

- Product changes touch `docs/`; user-visible content belongs in `data.js`.
- New state fields require defaults, migration coverage, and rollback behavior.
- Every `docs/` change bumps app, service-worker, and repository versions together.
- Safety behaviour requires mobile and desktop Playwright coverage.
- No network calls, dependencies, analytics, CDN assets, or cloud fallbacks may enter `docs/`.
- Shipped scripts stay ES5-safe (`var` / `function`; no transpile).
