# SoulCap — Safety & Truth Inventory

**Version:** 0.1.0 · **Updated:** 2026-07-19  
**Status:** Pre-production Cap Family Mega-Wave ship (docs + brand). **Not a clinical product launch.**

---

## Hard disclaimers

SoulCap is **not** clinical care, therapy, medical advice, diagnosis, or crisis counseling.

- It must **never** be marketed as “production therapy,” “clinical-grade care,” or a replacement for licensed professionals.
- If you are in crisis or danger: call/text **988** (US), text **HOME** to **741741**, use [IASP resources](https://www.iasp.info/resources/Crisis_Centres/), or dial local emergency services.
- Any AI companion language in this repo is **assistive / wellness-oriented** only.

---

## What actually exists (inventory)

| Surface | What it is | Wired to Nest API? | Production? |
|---|---|---|---|
| **Nest backend** (`backend/`) | Source for LMM, orchestration, keyword safety gate, panic resources, Prisma schema, modules listed in README | N/A (is the API) | **No** — not deployed; no lockfile/`node_modules` verified in this wave |
| **Expo mobile** (`mobile/`) | Thin client: Auth + Chat + Check-in screens; still carries legacy “Living Mind” strings in places | Intended (`apiUrl` → `/api/v1`) | **No** — assets/entry were incomplete before this wave; not store-ready |
| **PWA shell** (`docs/`) | Installable UI demo (Today / Soul / You / Panic cues) | **No** — **localStorage-only** mock data | **No** — demo / gallery surface |

README historically described a full product surface. Treat README feature lists as **architecture intent + source inventory**, not “live production therapy.”

---

## What is wired vs claimed

### Wired in backend source (code present)

- Keyword **safety quick-scan** + tiered assessment (`backend/src/ai/safety/safety-gate.service.ts`)
- Tier-3 style **hardcoded crisis response text** + 988 / Crisis Text Line / IASP pointers
- Panic module crisis resources + grounding exercise payloads
- Prompt rules: companion, not therapist/doctor/crisis counselor
- Orchestration path that can short-circuit to crisis mode when gate fires

### Not proven / not production-ready

- End-to-end crisis escalation to a real on-call team (webhook URL optional; ops not configured here)
- Clinical validation, IRB, licensed clinician review, or regulated medical device claims
- App Store / Play Store builds, HIPAA/BAA posture, production encryption ops proof
- PWA ↔ Nest chat/LMM (PWA does not call the API)
- Full mobile feature parity with README (journal, goals, voice, billing UI, etc.)
- Clean install: `bcrypt` / `@nestjs/jwt` used in auth code but **missing from `backend/package.json`** (compile blocker)
- Mobile entry: `package.json` pointed at `expo-router/entry` without an `app/` router tree (runtime blocker; fixed toward classic `App.tsx` in this wave)
- Prisma **migrations** folder absent (schema only) — deploy path incomplete
- CI / e2e / automated safety regression suite

---

## Crisis resources (always point users here)

- **988 Suicide & Crisis Lifeline** — call or text **988** (US)
- **Crisis Text Line** — text **HOME** to **741741**
- **IASP** — https://www.iasp.info/resources/Crisis_Centres/
- **Emergency** — 911 (US) or local emergency number

---

## Marketing honesty rules

| Do | Don’t |
|---|---|
| “AI emotional wellness companion (pre-production)” | “Clinical-grade therapy platform” |
| “Safety keyword gate + crisis resource handoff (in source)” | “Clinically validated crisis care” |
| “Living Mind Model (architecture / prototype)” | “Production therapy between sessions” |
| Link SAFETY.md from README | Imply store launch or regulated care |

---

## Blockers logged this wave

1. Backend auth deps incomplete (`bcrypt`, `@nestjs/jwt` not declared) — install/build may fail.
2. No Prisma migrate history — DB bring-up is manual/`db push` territory.
3. PWA demo not API-backed — do not demo as live LMM.
4. Mobile not store-ready; Expo config was broken (icons + entry) until brand wire-up.
5. No production deploy, secrets, or on-call webhook verified.
6. Skip full clinical launch (intentional).

Docs + brand still ship under `v0.1.0` so Cap Family truth is recorded without overclaiming readiness.
