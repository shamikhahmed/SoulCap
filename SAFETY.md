# SoulCap — Safety & Truth Inventory

**Version:** 0.7.0 · **Updated:** 2026-07-21
**Status:** **Clinical path** — self-guided wellness companion.
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.
See also `CLINICAL.md` and `Capricorn-Brain/AI/Claude-Code/SoulCap-Eval-Harness.md`.

---

## Hard disclaimers

SoulCap is **not** clinical care, therapy, medical advice, diagnosis, or crisis counselling.

- Market as **self-guided wellness companion (clinical path)** only.
- Never claim FDA/CE clearance, "clinical-grade therapy," or replacement for licensed professionals.
- Crisis routes are region-aware and shipped in `docs/data.js`.

---

## What actually exists (inventory)

| Surface | What it is | Wired to Nest API? | Production? |
|---|---|---|---|
| **PWA** (`docs/`) | **The product.** Offline skills engine, Constellation, safety kernel, local-only storage | **No** — deliberately. No network calls at all. | **Yes** — GitHub Pages |
| **Nest backend** | LMM + safety gate + panic + ClinicalModule stubs. Builds clean (0 TS errors) | Is the API | **No** deploy |
| **Expo mobile** | Thin Auth/Chat/Check-in | Intended | **No** store |

The PWA makes **zero network requests** after load. No account, no server, no analytics,
no LLM. Everything is `localStorage`.

Previous release preserved at `docs/legacy-v032.html`.

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
- 84 Playwright tests across mobile + desktop; safety tests gate the deploy in CI.

### Known gap fixed this release

Inflected crisis phrasings escaped the gate entirely — `end my life` is not a substring of
`ending my life`, so "I have been thinking about ending my life" scored **tier 0**. Found by
the new e2e suite. Fixed in both `docs/app.js` and `backend/src/ai/safety/safety-gate.service.ts`.

This is exactly the class of failure the eval harness exists to catch, and there are
certainly more of them still in there.

---

## Crisis directory — what is and isn't shipped

| Region | Shipped | Basis |
|---|---|---|
| US | 988, Crisis Text Line 741741, 911 | Long-established, publicly documented |
| UK | **Removed at owner request — routed to international** | Named lines deleted 2026-07-21; floor kept so the screen is never empty |
| **Pakistan** | Umang (24/7), Taskeen, Rozan, Rescue 1122 | Nationally-recognised, corroborated across Umang/Taskeen/Rozan/MHIN/UNFPA; owner to re-confirm before wide launch |
| UK / elsewhere | IASP directory + local emergency | "Find a Helpline" removed at owner instruction |

**Do not add a Pakistan-specific number without independent verification that it is live,
staffed, and its hours recorded.** A crisis number that rings out is worse than no number,
because the person has already reached the point of asking for help. Absent beats wrong.

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
