# SoulCap — Perfection Loop v3 · STATE

Updated: 2026-10-14T11:25:00Z  
Phase: **F** (hand Auditor — no P0/P1 found; SOL-V3-1 matrix L/D primary ✅)  
Branch: `perfection/soulcap-v3`  
App version: **8.3.2** (no release bump yet — Phase I after Auditor)  
Safety: Help / crisis / age-gate copy **unchanged** (§2.2 / §13.8).

## Tip
See latest commit on `perfection/soulcap-v3` (Builder-SoulCap Wave C).

## Tickets (§13.8)
| ID | Status | Notes |
|---|---|---|
| SOL-V3-1 | 🔧 IN PROGRESS → Auditor | Baseline device-qa **7/7 hard=0**; theme L/D matrix bridged + v3 viewer; ipad + full surface recapture continues Phase G |
| SOL-V3-2 | ✅ DONE | Already on `main` @ `32c6961` (finish merged) |
| SOL-V3-3 | 📨 Hub Engineer | Stale hub `shamikhahmed.github.io/SoulCap/` present @ 8.3.2 — confirm own-Pages is served, then remove hub copy (§12.5) |

## Baseline
- `qa/perfection/baseline/device-qa.json` — **7/7 hard-clean**, tap&lt;32=0, text&lt;11=0, pageErr=0
- Soft only: Chromium intermittent `ERR_CONNECTION_RESET` on a local asset (approach-packs / data.js) — not pageerrors

## Gallery
- Shared v3 viewer at repo root: `screen-gallery.{html,css,js}`
- Legacy 392-shot manifest preserved: `docs/screenshots/gallery/gallery-manifest.v1.json`
- Schema **v2** bridge (theme-light/theme-dark × mobile→iphone / desktop→mac): `gallery-manifest.json` (32 shots)
- Fresh v3 capture: `e2e/gallery-v3.spec.ts` (CAPTURE_GALLERY=1) → light/dark × iphone/ipad/mac

## Next 3 actions
1. Auditor: clean checkout + reproduce device-qa; spot-check Help in both themes (copy intact)
2. Builder Phase G: fill remaining inventory × ipad + default-pack surfaces into v2
3. Hub Engineer: SOL-V3-3 remove stale hub `SoulCap/` after own-Pages confirmation

## Reproduce
```bash
export PW_CORE=/Users/shamikhahmed/Projects/Cap/Cap-Apps/MasteryCap/node_modules/playwright-core
export PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright
cd /Users/shamikhahmed/Projects/Cap/Cap-Apps/SoulCap
git fetch && git checkout perfection/soulcap-v3 && npm ci
python3 -c "from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler as H; import os; os.chdir('docs'); ThreadingHTTPServer(('127.0.0.1', 8788), H).serve_forever()" &
cd /Users/shamikhahmed/Projects/Cap/Cap-Apps
node capricorn-tooling/scripts/device-qa.mjs SoulCap/qa/perfection/auditor \
  --apps=SoulCap --url='SoulCap=http://127.0.0.1:8788/?demo=1'
# Gallery: open http://127.0.0.1:8790/screen-gallery.html (npm run gallery:view from repo root)
```
