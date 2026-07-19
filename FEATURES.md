# SoulCap — Features (S/W/L/R)

**Updated:** 2026-07-19 · Clinical path · **v0.2.1**  
**Codes:** S = shipped · W = this wave · L = later · R = rejected

## S
- Real delete / privacy sheet / local reminder preference / Capricorn QR / `?demo=1`
- Honest README: PWA = product; Nest/Expo = source lab
- Nest backend **source**: LMM modules, orchestration, keyword safety gate, panic, Prisma schema · **ClinicalModule** stubs
- Expo thin client source: Auth / Chat / Check-in
- PWA clinical path: consent · Tier-3 chat rail · Panic/988 · clinician notes + local audit
- Cap brand icons · `VERSION.json` 0.2.0 · `SAFETY.md` · `CLINICAL.md`
- Safety-gate unit tests (`npm run test:safety`)

## W
- Clinical path v0.2.0 (all four bars: safety prod gate, clinician MVP, honest clinical-path copy, SaMD checklist)
- Auth orphan deps declared (`bcrypt`, `@nestjs/jwt`) · Prisma migrate baseline stub

## L
- Clerk THERAPIST role enforcement on `/clinical` · Prisma-backed notes/audit · PWA↔Nest live wire · deploy · CI
- Licensed clinician protocol review · QMS / SaMD classification if product claims harden
- Store builds · HIPAA/BAA ops proof

## R
- Claiming FDA/CE clearance, “clinical-grade therapy,” diagnosis, or crisis-counselor identity without validation
- Treating PWA localStorage notes as an EHR
