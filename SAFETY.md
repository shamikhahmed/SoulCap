# SoulCap — Safety & Truth Inventory

**Version:** 0.8.1 · **Updated:** 2026-07-22
**Status:** **Clinical path** — self-guided wellness companion.
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.
See also `CLINICAL.md` and `Capricorn-Brain/AI/Claude-Code/SoulCap-Eval-Harness.md`.

---

## Hard disclaimers

SoulCap is **not** clinical care, therapy, medical advice, diagnosis, or crisis counselling.

- Market as **self-guided wellness companion (clinical path)** only.
- Never claim FDA/CE clearance, "clinical-grade therapy," or replacement for licensed professionals.
- Help guidance is hard-coded, number-free, and country-agnostic.

---

## What actually exists (inventory)

| Surface | What it is | Wired to Nest API? | Production? |
|---|---|---|---|
| **PWA** (`docs/`) | **The product.** Offline skills engine, Constellation, safety kernel, local-only storage | **No** — deliberately. No network calls at all. | **Yes** — GitHub Pages |
| **Nest backend** | LMM + safety gate + panic + ClinicalModule stubs. Builds clean (0 TS errors) | Is the API | **No** deploy |
| **Expo mobile** | Thin Auth/Chat/Check-in | Intended | **No** store |

The PWA makes **zero network requests** after load. No account, no server, no analytics,
no LLM. Everything is `localStorage`.

Journal transcription uses `SpeechRecognition` only when the browser confirms an already-installed
on-device language pack with `processLocally: true`. SoulCap does not call `install()`, use the
remote-capable `webkitSpeechRecognition` fallback, or store audio blobs. Unsupported devices show
a local explanation and keep ordinary writing available.

Spoken exercise guidance uses only `speechSynthesis` voices marked `localService: true`. If the
browser exposes only remote-capable voices, SoulCap stays silent.

Historical releases remain available through Git history, not as publicly served legacy pages.

---

## Safety rails (v0.5)

- 37 techniques, each carrying its contraindications; the Calm filter removes contraindicated cards rather than ranking them down.
- Keyword tier gate (0–3) ported from Nest `SafetyGateService` into `docs/app.js`, so the
  same kernel runs offline. **The two lists must be kept in sync manually until the shared
  engine package exists.**
- Crisis flow is hard-coded and never generated.
- Help affordance present on every screen, including during onboarding **before consent**.
- Age gate: 18+. Under-18 is redirected to external youth services, not merely refused.
- Constellation `hard right now` suppresses all suggestions for that person, permanently
  and silently. No reconciliation nudges.
- The app never contacts anyone. "Open messages" hands off to the OS with an empty draft.
- 132 Playwright checks across mobile + desktop; safety tests gate the deploy in CI.
- Installed-app `?panic=1` now opens Help immediately and has a deploy-gating regression test.

### Known safety fixes

Inflected crisis phrasings escaped the gate entirely — `end my life` is not a substring of
`ending my life`, so "I have been thinking about ending my life" scored **tier 0**. Found by
the new e2e suite. Fixed in both `docs/app.js` and `backend/src/ai/safety/safety-gate.service.ts`.

This is exactly the class of failure the eval harness exists to catch, and there are
certainly more of them still in there.

---

## Reaching out — no crisis directory (v0.8.1)

**All crisis phone numbers and the country/region selection were removed at the owner's
instruction** (v0.7.1). Rationale: we cannot promise any specific line is reachable, and a number
that rings out is worse than none.

The help screen now gives **gentle, number-free, country-agnostic guidance**:
- "Reach out to someone you trust — a family member, a friend."
- One-tap **"Message someone I trust"** → opens the user's own messages (no specific contact).
- "If you feel unsafe or in danger, please contact your local emergency services or a crisis
  helpline in your area." — a category, not a number.

Onboarding no longer asks the user's country. If a future market wants verified local lines back,
re-introduce them per region behind the region-pack model and verify each is live before launch.

---

## Blockers remaining

1. **No licensed clinician has reviewed any skill card.** The Techniques screen says so in-product.
2. No Urdu clinical copy reviewer; no Urdu localisation shipped.
3. Safety kernel is still keyword-based. It cannot detect oblique risk
   ("I've been sorting out my things", "I finally feel calm about it all").
4. Nest not deployed; PWA does not call it.
5. Prisma migrate baseline still a placeholder; schema has new enum values needing a migration.
6. SaMD / QMS checklist mostly open (`CLINICAL.md`).

---

## Marketing honesty

| Do | Don't |
|---|---|
| Self-guided wellness companion (clinical path) | Clinical-grade therapy platform |
| Skills drawn from established public techniques | Clinically validated treatment |
| Keyword safety gate + crisis resource handoff | Clinically validated crisis care |
| "Not yet clinically reviewed" shown in-product | Imply clinician oversight that doesn't exist |
