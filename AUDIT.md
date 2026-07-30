# SoulCap — Full-phase audit

**Baseline:** app **8.0.2** · SW `soulcap-v802` · schema **v13** · audited **2026-07-30**  
**Companion:** `PERF.md` · `QA-MATRIX.md` · `IA-RATIONALE.md` · `ARCHITECTURE.md` · `SAFETY.md`

This is the Phase 1 map + Phase 13 status against the senior-team checklist. Product code = `docs/` only.

---

## 1. Architecture map

### Ships vs labs
| Surface | Role |
|---------|------|
| `docs/` | **Shipped PWA** — GitHub Pages. Zero network after load. |
| `e2e/` | Playwright gate (CI deploy). |
| `backend/` | NestJS lab — **not deployed**, PWA never calls it. |
| `mobile/` | Expo lab — **not shipped**. |
| `screen-gallery.html` + `docs/screenshots/gallery/` | Documented gallery (dev/marketing). |

### Runtime
```
docs/index.html → data.js → app.js (+ app.css)
  state: localStorage['soulcap_v1'] (DEFAULT.v = 13)
  theme mirrors: soulcap_theme, soulcap_appearance, soulcap_locale
  tabs: now · calm · journal · map · me
  overlays: panic, runner, journal editor, sheet
  SW: sw.js CACHE soulcap-v802; same-origin fetch only
  vendor: gsap.min.js, breath-orb.js (precached; no CDN)
```

### Design system
`docs/app.css` Quiet Depth — semantic tokens (`--ground`, `--surface`, `--ink*`, `--accent*`,
`--layer-0..3`, `--space-*`, `--type-*`, `--dur-*`, `--ease-*`, `--splash-bg`). Themes redefine
the same names: light, dark, night, ocean, forest, amoled + accent plum/lilac/mulberry.

### Safety
`assessRisk` + keyword lists in `docs/app.js` (tiers 0–3). Mirror in
`backend/src/ai/safety/safety-gate.service.ts` — keep hand-synced. PWA never ships crisis phone numbers.

### Version quartet (must match on every `docs/` ship)
`docs/sw.js` CACHE · `VERSION.json` · `APP_VERSION` in `docs/app.js` · `package.json` version.

---

## 2. Top risks

1. **Stale SW** — forget CACHE bump → users stuck. Mitigated by ship checklist + What's-new gate.
2. **Dual safety lists** — PWA vs backend lab drift.
3. **ES5-only `docs/`** — accidental ES6 breaks old mobile.
4. **Gallery drift** — UI change without `npm run gallery`.
5. **Wiring labs** — never connect Nest/Expo to PWA.
6. **`docs/` disk weight** — gallery PNGs dominate (~277MB tree); runtime critical path ~620KB.

---

## 3. Dead / unused (Phase 2)

| Item | Verdict |
|------|---------|
| `console.log` in `docs/` | **None** (2026-07-30 grep). |
| App `fetch` / XHR / CDN | **None** — only SW same-origin `fetch`. |
| Vendor files | Both used + precached. |
| `backend/_legacy/` | Quarantined — leave. Do not revive. |
| Hardcoded hex in CSS | Mostly token defs; splash now `var(--splash-bg)`. Theme preview swatches intentional. |
| `package-lock.json` `"version": "1.0.0"` | Lockfile metadata only — not the app version source of truth. |

No mass delete of business logic. App is one IIFE by design — “module boundaries” = comment sections + helpers, not a framework split.

---

## 4. Phase status (1–13)

| Phase | Status | Evidence |
|-------|--------|----------|
| **1 Discover** | **Done** | This file. |
| **2 Code health** | **Done (scoped)** | No console noise; no unused vendor; splash tokenised 8.0.2. No framework rewrite (would violate offline/ES5 rules). |
| **3 IA** | **Done** | SPEC-v8 / `IA-RATIONALE.md` · live Settings order Appearance→…→About · gear · one Profile · Example week. |
| **4 Design system / UI** | **Done (shipped Quiet Depth)** | Tokens + themes; gallery covers screens/themes. Residual: some component px still via token aliases. |
| **5 Forms / selection** | **Done** | Chips/toggles/segmented patterns; labels in `data.js`; journal/editor flows e2e. |
| **6 Platforms / modes** | **Done (PWA scope)** | Mobile+desktop Playwright; themes; safe-area CSS; no native iOS/Android ships — **labs skip**. |
| **7 Accessibility** | **Done** | W5 fail-gates; focus/200%; heatmap one summary; `ACCESSIBILITY.md`. |
| **8 Performance** | **Done** | `PERF.md` live numbers + budget test. |
| **9 Security / data** | **Done** | Local-only; XSS via `el()` not innerHTML for user data; zero external hosts live. |
| **10 APIs / DB / offline** | **Done (offline)** | No API/DB. SW precache + offline reload proven live. |
| **11 QA personas** | **Done** | `e2e/personas.spec.ts` + safety + app journeys. Matrix in `QA-MATRIX.md`. |
| **12 Docs / gallery** | **Done** | README/CHANGELOG/HANDOVER/IA + documented gallery + state filter. |
| **13 Final polish** | **Done this pass** | Audit pack + budget gate + splash token; verify before ship. |

---

## 5. Appendices — apply or skip

| Appendix | Apply? | Note |
|----------|--------|------|
| A Design foundations | Yes | Tokens in `app.css`. |
| B Launch / empty / about | Yes | Splash, welcome, onboard, Example cold-open, About from Settings. |
| C Deliverables | Yes | This audit + PERF + QA-MATRIX + demo `?demo=1`. |
| D Element QA | Yes | `QA-MATRIX.md` — primary interactives + e2e coverage (not every pixel of every theme click — gallery + theme axes cover presentation). |
| E Auth | **Skip** | No account / sign-in. |
| F Perf budgets | Yes | `PERF.md`. |
| G Data correctness | Yes | Check-in/screener/path calcs covered in e2e; no money/currency. |
| H Assets | Yes | Icons + maskable in `docs/icons/`; vendored offline. |
| I Notifications / deep links | **Skip** | No push. `?demo=1` / `?panic=1` query seeds only. |
| J i18n / RTL | **Partial** | English + Roman Urdu **preview** (labelled; safety English). Full RTL not shipped. |
| K Analytics | Yes (prove absent) | Zero external requests live; product promise. |
| L Update / version | Yes | CACHE bump + What's-new from `APP_VERSION`. |

---

## 6. Prioritized residual (honest, not blockers)

1. Optional axe-core CI pass (manual contrast samples already AA on primary surfaces).
2. Full RTL + reviewed clinical locale copy (blocked on native review).
3. Shrink or CDN-host marketing gallery weight outside SW precache (already not in CACHE).
4. Keep dual safety lists in sync when keywords change.

---

## 7. Decision log (this audit)

- **No Nest/Expo wiring** — product law.
- **No auth surface** — local-first promise.
- **Splash bg → `--splash-bg`** — Phase 4 token hygiene; values unchanged.
- **Budget e2e** — fail if critical assets balloon or external hosts appear after load.
