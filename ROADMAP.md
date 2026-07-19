# SoulCap — Roadmap

> Updated 2026-07-19. Fleet: `capricorn-tooling/shared/CAP-STANDARD.md`.  
> **Clinical path:** `CLINICAL.md` + `SAFETY.md`. No SaMD claim until review gate passes.

## Now — v0.2.0 (clinical path)
Consent + crisis rail + clinician panel (PWA) · Clinical API stubs · SaMD checklist · safety unit tests.

## Cap Standard gaps
| Item | Status |
|---|---|
| Docs pack | ✅ |
| SAFETY + CLINICAL | ✅ |
| Version | ✅ 0.2.0 |
| Brand icons | ✅ |
| Screen gallery | ❌ |
| QA / e2e | 🟡 safety unit only |
| CI gate | ❌ |
| PWA ↔ API | ❌ local demo |
| Clinician authz | 🟡 demo header |

## Next
1. Clerk `THERAPIST`/`ADMIN` enforcement on `/api/v1/clinical`
2. Persist clinical notes/audit in Prisma (not memory)
3. Wire PWA → Nest optional API URL
4. Licensed clinician protocol review
5. CI on `test:safety`

## Later
- Deploy · store · HIPAA/BAA · SaMD classification only if intended use hardens

## Ground rules
- Never claim medical device clearance without evidence
- Tag `vX.Y.Z`; bump `VERSION.json` + SW together
- Never commit `.env` / secrets
