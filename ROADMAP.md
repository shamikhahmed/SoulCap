# SoulCap — Roadmap

> Updated 2026-07-11. Fleet order & standard: `capricorn-tooling/shared/CAP-STANDARD.md`.

## Now — vMVP (unversioned)
Current shipped state. See `CHANGELOG.md` for how we got here.

## Cap Standard gaps
| Cap Standard item | Status |
|---|---|
| Docs pack | ✅ |
| Screen gallery | ❌ |
| Version discipline | ❌ |
| QA / e2e | ❌ |
| CI gate | ❌ |
| PWA polish | 🟡 |
| Demo mode | ❌ |

## Next (ordered)
1. Resume decision: this is the only 'active-build' app fully dormant — pick up or mark 'later' in brain note
2. If resumed: version scheme + CHANGELOG discipline (started in this pass), then tests before features
3. Clinical safety review pass before any real-user exposure — non-negotiable for this domain

## Later
- Backend deploy target
- App store strategy

## Ground rules
- No dirty trees: commit or discard before ending a session.
- CI green before tag; tag `vX.Y.Z` per release.
- Bump SW cache with any asset change (PWA apps).
- Never commit `.env` / secrets.
