# SoulCap HIG 3 rollout — report

**Branch:** `design/hig-3` (worktree `_workspace/SoulCap-hig`)  
**Date:** 2026-10-25  
**Version:** 8.5.0 / SW `soulcap-v850`  
**Accent kept:** Amethyst (`--tint` / `--tint-text` from brand `--accent`)

## Files changed (summary)

| Area | Paths |
|---|---|
| Tokens / cascade | `docs/css/design/tokens.css`, `system.css`, `soulcap.css`, `docs/css/cascade.css` |
| Shell / scroll | `docs/js/scroll-lock.js`, `docs/index.html`, `docs/app.js` (ScrollLock, preventScroll, selectTab) |
| SW | `docs/sw.js` — no auto skipWaiting / clients.claim |
| Verify | `scripts/ios-behaviour-check.mjs`, `package.json` `ios:check` |
| Tests | `e2e/viewport.spec.ts`, `e2e/app.spec.ts` (floating bar / sidebar ≥700) |
| Docs | `DESIGN.md`, `CHANGELOG.md`, `VERSION.json`, `docs/VERSION.json`, `HANDOVER.md`, `SAFETY.md` |
| Evidence | `qa/hig/*` |

## ios-behaviour-check

Engine: Chromium + iPhone 15 Pro metrics (WebKit abort trap on this host; script falls back).

| Target | Result |
|---|---|
| origin/main (`SoulCap/docs` @ 8811) | **16 PASS / 7 FAIL** — see `ios-check-origin-main.txt` |
| `design/hig-3` (@ 8810) | **24 PASS / 0 FAIL** — see `ios-check-branch.txt` |

Main FAILs (expected pre-HIG): floating bar gap, content pad vs bar, map sideways overflow, sheet ScrollLock / openSheet export, SW auto skipWaiting + clients.claim.

## Playwright suite

| Target | Result |
|---|---|
| `design/hig-3` | **372 passed**, 16 skipped, **0 failed** (~2.4m) — `suite-branch.log` |
| Safety | **50 passed** (`e2e/safety.spec.ts`) |

origin/main suite not re-run end-to-end in this session (would need a clean main worktree on 8788); prior fleet baselines for SoulCap on main were green before this reskin. Branch is green including safety.

## Evidence PNGs

- `before-phone-light.png` / `after-phone-light.png` (+ `pairs-phone-light.png` if PIL available)
- `before-phone-dark.png` / `after-phone-dark.png`
- `before-ipad.png` / `after-ipad.png`

## Known gaps

1. WebKit binary aborts on this machine — ios-check uses Chromium fallback (logged as `PASS engine`).
2. Full-screen panic / runner / journal editor still use their own scroll containers (intentional crisis UX); ScrollLock still pins the document behind them.
3. No PR / push (owner instruction for this worktree session).
4. `hig-rollout-vaultcap.md` status row recorded below for hand-off (canonical session note lives outside the repo).

### Status table row (for hig-rollout-vaultcap.md)

| App | PR | ios:check main → branch | suite |
|---|---|---|---|
| SoulCap | _(local `design/hig-3`, not pushed)_ | 7 FAIL → 24/24 | 372 pass / 16 skip; safety 50/50 |
