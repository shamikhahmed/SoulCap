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
