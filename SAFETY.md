# SoulCap — Safety & Truth Inventory

**Version:** 8.3.1 · **Updated:** 2026-09-14
**Status:** **Clinical path** — self-guided wellness companion.
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.
See also `CLINICAL.md` and `Capricorn-Brain/AI/Claude-Code/SoulCap-Eval-Harness.md`.

---

## Hard disclaimers

SoulCap is **not** clinical care, therapy, medical advice, diagnosis, or crisis counselling.

- Market as **self-guided wellness companion (clinical path)** only.
- Never claim FDA/CE clearance, "clinical-grade therapy," or replacement for licensed professionals.
- Help is hard-coded, **number-free, and country-agnostic** (offline). No crisis phone numbers and no country/region picker — SoulCap cannot promise any specific line is reachable, and a number that rings out is worse than none (owner-locked). It guides the user to someone they trust and to local emergency services as a category, and never contacts anyone for the user.

**Qualified clinical review is required before any store submission** (none planned under G-1). Recorded 2026-09-14.

### Pattern + screener copy (SPEC-v8 W7)

Local **pattern observations** and optional **reflection checks** (PHQ-9 / GAD-7 style) are
on-device, user-correctable, and **not clinician-reviewed**. Wording stays non-diagnostic
(no severity verdicts). Item-9 and tier-3 free text open hard-coded Help. About & Legal keeps
the single not-medical line. **Do not claim clinical review** until a licensed clinician signs off.

---

## Crisis resources — number-free (owner-locked, restored 8.3.1)

**No crisis phone numbers. No country/region picker.** A previous change (8.2.x) re-introduced a
region picker with verified `tel:` numbers (Samaritans 116 123, 988, 999, 911, etc.); this was
reverted in **8.3.1** to honour the owner's standing decision. Rationale: SoulCap cannot guarantee any
specific line is live, and a number that rings out is worse than none.

The "Get help now" screen is hard-coded and offline. It:
- states: if you might hurt yourself or someone else, or you're in danger, contact your **local
  emergency services** now (a category — not a number);
- guides the user to **reach out to someone they trust** (a family member or a friend);
- offers **"Message someone I trust"** → opens the user's own messages with an empty draft (`sms:`, no
  recipient, no number);
- ends with: *"SoulCap isn't a crisis service and can't contact anyone for you."*

Help is always reachable (every tab, before consent, `?panic=1`). Tier-3 free text routes here. No
`tel:` links anywhere. If a future market wants verified local lines, re-introduce them per region
behind a region-pack model **only with the owner's explicit go-ahead**, verifying each is live.

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

The optional short phrase in detailed check-ins — and free text in journal entries, Your story,
safety plan, parked thoughts, constellation notes, manual lines, and principles — is assessed by
the existing keyword safety kernel on-device. Tier-3 wording opens the same hard-coded Help flow;
content still saves when storage allows (even if Help opens). Detailed dimensions, direct needs,
trigger tags, summaries, and pattern evidence all remain local.

Six bundled library articles are evidence-informed educational content, not diagnosis or treatment.
Every article shows that it is not yet reviewed by a licensed clinician, includes a bounded
professional-support section, and links only to existing hard-coded exercises. Daily supports
record optional per-day IDs only and create no streak, adherence score, reminder, or safety claim.

**Guided Path (v2.1)** is rule-based chip routing to exercise *families* with educational footnotes.
It never diagnoses, never says “start CBT/DBT/ACT,” never shows severity scores.
Panic-like chip clusters open the same hard-coded number-free Help screen. Path free-text
is not collected in the v2.1 core (chips only). Path copy carries an in-sheet “not yet clinically
reviewed” notice until sister / licensed sign-off.

Historical releases remain available through Git history, not as publicly served legacy pages.

---

## Safety rails (v0.5)

- 37 techniques, each carrying its contraindications; the Calm filter removes contraindicated cards rather than ranking them down.
- Keyword tier gate (0–3) ported from Nest `SafetyGateService` into `docs/app.js`, so the
  same kernel runs offline. **The two lists must be kept in sync manually until the shared
  engine package exists.**
- Crisis flow is hard-coded and never generated.
- Help affordance present on every screen, including during onboarding **before consent**.
- Age gate: 18+. Under-18 is declined gently and pointed to a trusted adult or an appropriate
  local support service.
- Constellation `hard right now` suppresses all suggestions for that person, permanently
  and silently. No reconciliation nudges.
- The app never contacts anyone. "Open messages" hands off to the OS with an empty draft.
- ~260 Playwright checks across mobile + desktop; safety tests (including free-text tier-3 Help and
  Guided Path Help / no-diagnosis lexicon) gate the deploy in CI.
- Installed-app `?panic=1` now opens Help immediately and has a deploy-gating regression test.

### Known safety fixes

Inflected crisis phrasings escaped the gate entirely — `end my life` is not a substring of
`ending my life`, so "I have been thinking about ending my life" scored **tier 0**. Found by
the new e2e suite. Fixed in both `docs/app.js` and `backend/src/ai/safety/safety-gate.service.ts`.

This is exactly the class of failure the eval harness exists to catch, and there are
certainly more of them still in there.

---

## Reaching out — no crisis directory (v1.1.0)

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

## v10 therapist-informed frameworks (8.1.0) — safety notes

Added, web-verified 2026-09-14, folded into the You tab. All reflective, non-diagnostic,
user-correctable, local-only; free text runs the keyword safety kernel (tier-3 → hard-coded Help).

- **Name a feeling** (emotion wheel, Tier A — affect labeling): vocabulary, not assessment.
- **Reframe a harsh thought** (Tier B): borrows the EMDR NC/PC construct but is a **CBT-style belief
  reframe only — NEVER EMDR**. No eye movements, bilateral stimulation, or memory reprocessing, and
  the word "EMDR" is never shown. VoC-style 1–7 is personal, not a score.
- **Thinking traps** (Tier A): cognitive distortions + thoughts·feelings·actions triangle. Noticing a
  trap is never a verdict.
- **Steady your system** (Window of Tolerance, Tier B): routes to existing breath / grounding /
  check-in. No clinical labels as verdicts.
- **Comfort · Stretch · Panic** (Tier C): psychoeducation + self-rated step size. "Comfort is allowed."
- **SUDS 0–100**: personal noticing, never gamified.
- **Stories**: **clearly-labelled fictional/composite** ("a made-up example, not a real person"),
  concrete, no exaggeration, no graphic crisis detail, always end in realistic hope/agency.

**Grounded heuristics, not machine learning.** All suggestions/content are AUTHORED from how these
frameworks are used in clinical/case literature and encoded as transparent, inspectable rules with
confidence + one-tap correction. The app does **not** train on user data, and makes **zero** network
calls — the privacy promise is intact.

## Blockers remaining

1. **No licensed clinician has reviewed any skill card, library article, Guided Path, pattern,
   screener, or v10 framework/story copy.** Calm / path / About say so in-product. Pattern + screener
   + all v10 frameworks remain reflection-only. This gate is now **larger**: the belief reframe is
   EMDR-adjacent and the stories touch distress — both especially need review before any "reviewed"
   or "clinically safe" claim. **Review checklist: `CLINICAL-REVIEW.md`** (exact copy + question per surface).
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
