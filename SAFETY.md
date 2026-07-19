# SoulCap — Safety & Truth Inventory

**Version:** 0.2.3 · **Updated:** 2026-07-19  
**Status:** **Clinical path** — clinician-supported wellness companion.  
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.  
See also `CLINICAL.md`.

---

## Hard disclaimers

SoulCap is **not** clinical care, therapy, medical advice, diagnosis, or crisis counseling.

- Market as **clinician-supported wellness companion (clinical path)** only.
- Never claim FDA/CE clearance, “clinical-grade therapy,” or replacement for licensed professionals.
- Crisis: call/text **988** (US), text **HOME** to **741741**, [IASP](https://www.iasp.info/resources/Crisis_Centres/), or local emergency services.

---

## What actually exists (inventory)

| Surface | What it is | Wired to Nest API? | Production? |
|---|---|---|---|
| **Nest backend** | LMM + safety gate + panic + **ClinicalModule** stubs | Is the API | **No** deploy |
| **Expo mobile** | Thin Auth/Chat/Check-in | Intended | **No** store |
| **PWA** (`docs/`) | Consent · crisis rail · clinician panel · local audit | **No** (localStorage) | Demo / clinical-path UX |

---

## Safety rails (v0.2)

- Keyword **Tier-3** hard list in Nest `SafetyGateService` + mirrored in PWA `sendMessage`
- Hard rails: no therapist identity · no diagnosis language
- Panic overlay + 988 copy
- Versioned local consent `sc_consent_v1`
- Local audit log for consent / panic / crisis / notes

---

## Blockers remaining

1. Nest not deployed; Clinical stubs need `x-clinical-demo: 1` until Clerk THERAPIST role authz
2. PWA still not calling Nest (honest local demo)
3. Prisma migrate baseline is placeholder — full schema via `db push` / real migrate still ops work
4. Licensed clinician review before real-patient PHI
5. SaMD / QMS checklist mostly open (`CLINICAL.md`)

---

## Marketing honesty

| Do | Don’t |
|---|---|
| Clinician-supported wellness companion (clinical path) | Clinical-grade therapy platform |
| Safety keyword gate + crisis resource handoff | Clinically validated crisis care |
| Links to CLINICAL.md + SAFETY.md | Imply FDA clearance or diagnosed treatment |

Docs ship under **v0.2.3** so Cap Family truth records the clinical path without overclaiming SaMD readiness.
