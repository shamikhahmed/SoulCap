# SoulCap Architecture

**Version:** 1.2.0 · **Product boundary:** `docs/`

## System shape

SoulCap is a static, offline-first PWA with no runtime dependency graph and no build step.

```text
GitHub Pages
  └─ docs/
      ├─ index.html  static shell and dialogs
      ├─ data.js     user-visible content and deterministic catalogues
      ├─ app.js      state, routing, safety, ranking, patterns, rendering
      ├─ app.css     theme-aware design system
      └─ sw.js       same-origin precache and offline shell

Browser
  ├─ localStorage['soulcap_v1']       canonical user state
  ├─ localStorage['soulcap_theme']    pre-paint theme mirror
  └─ localStorage['soulcap_appearance'] pre-paint display mirror
```

`backend/` and `mobile/` are isolated labs. The shipped PWA does not import them, call them, or
depend on their availability. A backend feature is not a product feature until a separate privacy,
security, safety, and deployment decision explicitly changes that boundary.

## Runtime flow

1. `index.html` applies validated theme and presentation attributes before CSS loads.
2. `app.js` loads `soulcap_v1`, runs sequential migrations, and merges nested defaults.
3. `render()` rebuilds the active view with `el()`; no user content enters `innerHTML`.
4. Preference and content writes attempt `save()` first; failures roll back in-memory state and
   show a calm notice before any accepted re-render. Some UI-only toggles (e.g. Calm filters)
   stay ephemeral on purpose.
5. The service worker precaches the complete shell and never fetches third-party assets.

## Personalisation model

Personalisation is deterministic and inspectable:

- explicit arrival word and direct need carry the strongest recommendation weight;
- declared concerns and history add bounded context;
- previous helpful feedback adds a small weight;
- ambient time is weaker than explicit intent;
- recent exercises are down-ranked to avoid repetition;
- journal text is never mined;
- trauma caution removes potentially activating techniques from automatic suggestions.

Pattern cards are a separate observation layer. They require at least five distinct check-in days
before analysis and three distinct supporting days before surfacing. Each card exposes evidence
dates and supports confirm, reject, hide, and global off controls. Correlation is never described
as cause or diagnosis.

Bundled library articles are static content in `data.js`. Search runs only against article
metadata in browser memory; related actions resolve stable IDs from the existing skill catalogue.
Daily supports persist only selected IDs and IDs marked for a local calendar day. They do not feed
recommendation ranking, patterns, scores, or notifications.

## Safety boundary

The keyword kernel in `docs/app.js` is the only runtime risk assessor. Its lists mirror
`backend/src/ai/safety/safety-gate.service.ts`. Help content is hard-coded, number-free, and
country-agnostic. Short text entered specifically in check-in detail is assessed locally; journal
text remains private and uninspected.

## Change rules

- Product changes touch `docs/`; user-visible content belongs in `data.js`.
- New state fields require defaults, migration coverage, and rollback behavior.
- Every `docs/` change bumps app, service-worker, and repository versions together.
- Safety behavior requires mobile and desktop Playwright coverage.
- No network calls, dependencies, analytics, CDN assets, or cloud fallbacks may enter `docs/`.
