# SoulCap — APP-REPORT v3

**Version / tag:** 8.4.0 / `v8.4.0`  
**Live URL:** https://shamikhahmed.github.io/SoulCap/?demo=1  
**Merge SHA:** `c214447` · release `b689e6e` · tag `v8.4.0`  
**Report date:** 2026-10-14  
**Deploy:** own GitHub Pages (`docs/`)

## Gates (§8.2)

| Gate | Result | Notes |
|---|---|---|
| SW-truth / G-8 | PASS | `8.4.0` · `soulcap-v840` · live VERSION.json = 8.4.0 |
| device-qa baseline | PASS 7/7 hard | soft chromium hubConsole possible |
| device-qa **live** v8.4.0 | PASS 7/7 | `qa/perfection/live-v8.4.0/` — hard=0 tap=0 text=0 pageErr=0 hubConsole=0 |
| Pages deploy | PASS | pages-build-deployment success |
| Verify and deploy CI | FAIL (non-blocking live) | investigate separately — Pages + live QA green |
| Help / crisis safety | PASS | copy unchanged (DECISIONS §4.2–§4.3) |
| Gallery G17 | PARTIAL | schema-v2 bridge + v3 viewer; ipad fill continues Phase G |
| Docs truth | PASS (manual) | CHANGELOG · VERSION · SAFETY stance |
| Lighthouse §7.11 | OPEN | later |
| Auditor stamp | — | released on device-qa clean + no open P0/P1 |

## Device-qa summary (live)

All 7 device/engine cells OK on live `/SoulCap/?demo=1` after 8.4.0 / `soulcap-v840`.

## Items closed / status

| ID | Severity | Status |
|---|---|---|
| SOL-V3-1 | P2 | 🔧 FIXED (await Auditor) — matrix L/D + gallery v3 |
| SOL-V3-2 | P3 | ✅ DONE |
| SOL-V3-3 | P2 | 📨 Hub Engineer (stale hub SoulCap/ cleanup) |
| SOL-V3-4 | P3 | L / monitor |

## Decisions applied

G-8 next minor 8.4.0 · never weaken Help/crisis · own-Pages canonical

## Docs updated

CHANGELOG · VERSION.json · docs/VERSION.json · docs/sw.js · docs/app.js APP_VERSION · README · qa/perfection/*

## Remaining

- SOL-V3-3 Hub stale-copy removal
- Phase G gallery ipad/full surface fill
- CI Verify-and-deploy failure triage
- Lighthouse to §7.11
