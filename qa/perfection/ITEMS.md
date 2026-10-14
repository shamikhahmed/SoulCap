# SoulCap — Perfection Loop v3 · ITEMS

Seeded from CURSOR-PERFECTION-LOOP.md §13.8.  
**Safety rule:** never weaken Help / crisis / age-gate copy (DECISIONS §4.2–§4.3).

### SOL-V3-1 — Matrix completeness both themes (device scan clean)
severity: P2 · status: 🔧 FIXED (Builder) — await Auditor  
Where: gallery + device-qa · light + dark · phone / iPad / Mac  
Evidence: `qa/perfection/baseline/device-qa.json` (hard=0); `docs/screenshots/gallery/gallery-manifest.json` schema 2; `screen-gallery.html`  
Cause: Legacy gallery was flat v1 (392 shots, pack/variant) — not schema-v2 theme×device rails; no shared v3 viewer  
Fix: Install shared viewer; bridge theme-light/theme-dark → `light|dark`/`iphone|mac`; add `e2e/gallery-v3.spec.ts` for full device classes; Playwright → 1.63  
Open residual: ipad cells + remaining inventory surfaces (default pack) → Phase G fill  
Auditor: —

### SOL-V3-2 — Switch local repo to main (finish merged)
severity: P3 · status: ✅ DONE  
Where: SoulCap git  
Cause: finish branch already merged  
Fix: Phase 0 / Builder started from `main` @ `32c6961` → `perfection/soulcap-v3`  
Auditor: N/A (git fact)

### SOL-V3-3 — Confirm served copy; remove stale hub SoulCap/
severity: P2 · status: 📨 HANDOFF Hub Engineer  
Where: `shamikhahmed.github.io/SoulCap/` vs SoulCap own Pages  
Cause: Hub still carries a `SoulCap/` tree @ 8.3.2 alongside own-Pages deploy path (§12.5)  
Fix: Hub Engineer confirms live `/SoulCap/` is own-Pages, then deletes hub copy and keeps redirects  
Builder note: live `VERSION.json` reads 8.3.2; hub tree present in `shamikhahmed.github.io/SoulCap/`  
Auditor: —

### SOL-V3-4 — Chromium soft ERR_CONNECTION_RESET on local asset (baseline)
severity: P3 · status: ⏳ OPEN (L / monitor)  
Where: Chromium macbook/android device-qa soft warn  
Cause: Intermittent reset loading `data/approach-packs.json` or `data.js` under threaded static serve — not a pageerror  
Fix: — (no hard fail; re-check on live after release)  
Auditor: —
