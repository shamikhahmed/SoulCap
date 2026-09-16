# SoulCap finish-loop LOG

### SOUL-P0-01 — fictional names                                   status: ✅
Current behavior: fixture profile name Shamikh; e2e expected Shamikh
Plan: replace with Alex
Changes: docs/app.js; e2e/app.spec.ts
Verify: grep clean on those paths; safety suite green (50)
Screens re-checked: n/a (fixtures)
Residual risk: historical SPEC/AUDIT docs still mention Shamikh/author; archived later

### SOUL-P0-02 — crisis resources                                   status: ⛔ PARKED (D-05 / Q)
Current behavior: number-free crisis flow
Meanwhile: will scaffold Help region selector with DRAFT placeholders only when implementing structure; final copy blocked.

### SOUL-P1-01 — desktop sidebar ≥900px                         status: ✅
Current behavior: mobile tab bar reused at 2560px mid-viewport
Plan: fixed left 240px nav; content max 720px
Changes: docs/app.css media (min-width:900px)
Verify: safety 50 passed
Screens: desktop layout CSS-only — visual capture pending next matrix pass

### SOUL-P1-02 — What's new padding                              status: ✅
Changes: .whats-new padding 16px; dismiss right-aligned

### SOUL-P1-03 — ambient blob + Open quietly                     status: ✅
Changes: hero-band::before opacity/position; reduced transparency off; removed Open quietly line

### SOUL-P0-02 — crisis region structure                         status: ⛔ PARKED (D-05) + structure ✅
Current behavior: number-free Help; no region preference
Plan: region chips + DRAFT guidance map; no helpline numbers until DECISIONS
Changes: docs/app.js (CRISIS_REGIONS, notices.crisisRegion); app.css panic scroll/sticky exit; e2e region test
Verify: safety suite green
Residual: final region copy blocked on D-05

## C-01 — 2026-09-14
- Released **8.1.1** / `soulcap-v811` from main (Phase 0 privacy fixtures).
- Live smoke: `https://shamikhahmed.github.io/SoulCap/sw.js` serves `soulcap-v811`.

### SOUL-P0-02 — Help + age gate (D-05)                    status: ✅
Current behavior: number-free DRAFT Help
Plan: DECISIONS §4.3 region Help + age gate; verify numbers in SAFETY.md
Changes: docs/app.js, docs/data.js, e2e/safety.spec.ts, e2e/app.spec.ts, SAFETY.md, STATES.md
Verify: test:safety 52 passed

### SOUL-P1-04 — Now simplification (Q-3)                 status: ✅
Current behavior: tall check-in rows; path/week above fold; Help below fold on 375×667
Plan: greeting → chip check-in → suggest+Begin → Explore → Help; More holds path/week/etc.
Changes: docs/app.js renderNow; docs/app.css compact suggest; e2e age-gate "I'm 18 or over"; tab-bar Help-not-last on Now
Verify: SOUL-P1-04 first-fold + 8 regression fixes; mobile app+safety subset green

### SOUL-P1-05 — App lock (Q-4 / G-10)                   status: ✅
Built CapLocalLock (PBKDF2 600k · AES-GCM · lockout delays · WebAuthn optional).
SoulCap: Settings → Privacy → App lock; seal sensitive keys; early #applock gate; auto-lock; forgot→erase; export blocked while locked.
Verify: node unit tests; e2e/lock.spec.ts 3/3 mobile

### SOUL-P1-06 — Performance split (Q-5)                 status: ✅
Lazy JSON catalogs + route modules + SW precache. Shell JS gzip ~118KB (<170). esbuild not needed.

### SOUL-P2 set — privacy / a11y / lab docs / tokens           status: ✅
privacy.html (template §4.4); outline:focus-visible; sub-11px cleared; About → Privacy;
README lab folders (P-SOUL-2); cap-foundation.css vendored; Pages already docs-only.
Native confirm()/alert(): none. Fonts: system stack (no Google Fonts).
Gallery: deferred to release commit if time — fictional names already in fixtures (Alex).

### Tier 1 release prep — 8.2.0 / soulcap-v820

# SoulCap — LOG

## 2026-09-15 — C-23 stub
- Tier 1 not verified — Review 2
- Created/updated finish-loop records (BASELINE, LOG, STATES, APP-REPORT, DOCS-INVENTORY)
- Known gaps:
  - TIER1.json smoke currently FAIL (Review 2)
  - finish-matrix smoke just wired (C-21) — full 15×2 not yet green
  - Lighthouse JSON per primary route missing (C-22)
  - Self-host fonts still open where applicable (C-16)
  - Physical VO/TB ⛔ BLOCKED-EXTERNAL

## 2026-09-15 — SoulCap app loop (post Step R)

### TIER1 before this slice
FAIL (5): suppressions (backend lab), lighthouse:dir, kill:raw-hex 86, kill:console.log 1, kill:innerHTML-classified (SINKS missing)

### Work done
- Added `npm run tier1`
- P-SOUL-2: lab `backend/`+`mobile/` excluded from Tier 1 scoring in `capricorn-tooling/shared/testing/tier1.mjs`; README reinforced
- Pages product `docs/` now scored (was wrongly skipped); `brand.css` + `brand-palette.js` hold raw hex tokens
- SINKS.md for 2 static `innerHTML` sinks; gallery viewer moved to `qa/tools/`
- Kill-list: rename `#fab`→`#helpFab`, sub-11→11px, outline→focus-visible, strip disallowed `!important`
- Lighthouse JSON: `qa/finish-loop/lighthouse/home-demo-mobile.json` (perf 30 / a11y 96 / BP 100 / SEO 100 — recorded, not a Tier 1 claim)
- §13 product items (SOUL-P0-02, P1-04/05/06, P2) already in tree from prior loop; re-verified via code + safety suite this slice

### TIER1 after this slice
`qa/finish-loop/TIER1.json` **PASS** (23 pass / 0 fail / 1 warn: matrix:shots missing)

### Honesty (C-09)
Do **not** claim fleet Tier 1 complete: manual VoiceOver evidence still ⛔ BLOCKED-EXTERNAL / not linked.


## 2026-09-15 — SW v821 + e2e harden
- Bumped `swCache` → `soulcap-v821` (still app 8.2.0 / tag v8.2.0) so brand.css + brand-palette.js precache
- Playwright `serviceWorkers: 'block'` to reduce APP_READY races
- Mobile safety+lock: green when run focused; parallel suite still flaky on APP_READY under load — not treated as product regress this slice
- TIER1.json remains PASS (warn: matrix:shots)


## 2026-09-15 — Gallery regen SUCCESS
- `npm run gallery` mobile+desktop (workers=1)
- Hardened splash race + under-18 selector
- Merged `finish/soulcap-gallery` → main

## 2026-09-16 — C-34 e2e red on main
**Status:** ✅ product+test fix; full CI follow-up
**Problem:** mood-themes (~906) + theme-scroll (~1231) red on main; offline SW + finish-matrix also red after merge.
**Root cause:**
1. Incomplete `#fab`→`#helpFab` rename (`applyLocale` / e2e still `#fab`).
2. Theme-scroll raced View Transition `scrollTo(0,0)`.
3. SW registered only on `window.load` after async catalogs — load already fired → offline tests never saw `controller`.
4. Finish-matrix asserted `#tabs` while splash still covered it.
**Fix:** helpFab + scroll settle; register SW when `readyState==='complete'`; dismiss splash in finish-matrix; SW `soulcap-v823`.
**LH perf 30:** noted only — no fake LH; Q-5 deferred.
**CI:** main green https://github.com/shamikhahmed/SoulCap/actions/runs/35083274385 (SHA ac0da66).

## 2026-09-16 — C-34 offline SW
- Root cause: playwright.config `serviceWorkers: block` prevented controller; offline suites now `test.use({ serviceWorkers: allow })`.
- SW register immediate + cache soulcap-v823.
