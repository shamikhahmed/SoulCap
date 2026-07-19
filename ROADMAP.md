# SoulCap — Roadmap

> Updated 2026-07-19. Fleet order & standard: `capricorn-tooling/shared/CAP-STANDARD.md`.  
> **Safety-first:** see `SAFETY.md`. No clinical / store launch until review gate passes.

## Now — v0.1.0 (pre-production)
Docs + brand Mega-Wave shipped. Backend/mobile/PWA are source/demo — not production care.

## Cap Standard gaps
| Cap Standard item | Status |
|---|---|
| Docs pack | ✅ |
| SAFETY.md / honesty | ✅ (v0.1.0) |
| Version discipline | ✅ 0.1.0 |
| Brand icons | ✅ |
| Screen gallery | ❌ |
| QA / e2e | ❌ |
| CI gate | ❌ |
| PWA ↔ API | ❌ (localStorage demo) |
| Demo mode | 🟡 PWA mock only |

## Next (ordered)
1. Unblock local backend install (`bcrypt`, `@nestjs/jwt` in package.json) + Prisma migrate path
2. Wire or clearly demote PWA vs Nest (no fake live LMM demo)
3. Clinical safety review pass before any real-user exposure — non-negotiable
4. CI + smoke tests on safety gate

## Later
- Backend deploy target
- App store strategy
- Clinical validation partnership (only if product direction continues)

## Ground rules
- No dirty trees: commit or discard before ending a session.
- Tag `vX.Y.Z` per release; bump `VERSION.json` + SW cache together.
- Never claim clinical care / production therapy without validation.
- Never commit `.env` / secrets.
