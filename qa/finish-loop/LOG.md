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
