# SoulCap — Clinician review checklist

**For:** a licensed clinician (the owner's therapist to start).
**Why:** nothing in SoulCap has been clinician-reviewed. This file lists exactly what to read and the
question to answer for each, so a review is fast and complete. Until items here are signed off, the
app keeps its in-product "reflection only / not therapy / not a diagnosis" framing and makes **no**
"reviewed" or "clinically validated" claim.

**How to review:** copy lives in `docs/data.js` (content) and is shown by `docs/app.js` (sheets).
Reviewer marks each row ✅ approved / ✏️ change (note wording) / ❌ remove. Owner applies changes,
then updates the status here and in `SAFETY.md`.

## Ground rules the copy must keep (all frameworks)
- Non-diagnostic — never tells the user what they "have".
- Reflective/optional — no pressure, no scores to beat, no streaks.
- Free text is checked by the keyword safety kernel; tier-3 → hard-coded number-free Help.
- No crisis phone numbers; no claim of therapy/EMDR/medical advice.

---

## v10 frameworks (8.1.0) — priority review

| # | Framework | Where (data.js) | Evidence | Reviewer question | Status |
|---|-----------|-----------------|----------|-------------------|--------|
| 1 | Emotion wheel — "Name a feeling" | `EMOTION_WHEEL`, `EMOTION_UI` | A (affect labeling) | Are the core→nuanced word groupings clinically sensible and non-loaded? | ⬜ |
| 2 | Belief reframe — "Reframe a harsh thought" | `REFRAME_UI`, `REFRAME_FAMILIES` | B (EMDR NC/PC construct, used as CBT reframe) | **Highest priority.** Are the negative/positive cognition examples safe and non-triggering? Is the "not EMDR" framing sufficient? Any belief that could backfire? | ⬜ |
| 3 | Thinking traps + triangle | `DISTORTIONS`, `TRIANGLE_UI` | A (CBT) | Are the 8 distortions + counter-questions accurate and gently worded? | ⬜ |
| 4 | Comfort/Stretch/Panic zones | `ZONES_UI` | C (learning zones / graded exposure) | Is "comfort is allowed" + panic→shrink safe for avoidant/anxious users? | ⬜ |
| 5 | Window of Tolerance — "Steady your system" | `WOT_UI` | B (Siegel/Porges) | Are hyper/hypo descriptions + the routing (breath vs activation) correct and safe? | ⬜ |
| 6 | SUDS 0–100 | `SUDS_UI` | A | Framed as personal noticing (not a target)? OK? | ⬜ |
| 7 | Stories (×6) | `STORIES` | lived-experience | **High priority.** Each: concrete, no exaggeration, no graphic crisis detail, ends in realistic hope? Any that could re-traumatize? | ⬜ |

## Pre-existing surfaces still needing review (unchanged by 8.1.0)
| # | Surface | Where | Status |
|---|---------|-------|--------|
| 8 | 38 techniques (instructions + contraindications) | `SKILLS` in data.js | ⬜ |
| 9 | Library articles | `ARTICLES` | ⬜ |
| 10 | Guided Path routing + footnotes | path data | ⬜ |
| 11 | Pattern engine observation copy | `PATTERN_UI` | ⬜ |
| 12 | Screeners (PHQ-9 / GAD-7) framing + item-9 → Help | `SCREENERS`, `SCREENER_UI` | ⬜ |
| 13 | Self-concept reflection | `SELF_CONCEPT_UI` | ⬜ |
| 14 | Habit-loop / urge-surfing | `HABIT_UI` | ⬜ |
| 15 | Safety kernel word lists (do they miss oblique risk?) | `CRISIS_*` in app.js | ⬜ |

## After sign-off
- Update `SAFETY.md` "Blockers remaining" #1 to reflect what is now reviewed.
- Only then may marketing/store copy say a reviewed clinician checked those specific surfaces — and
  even then: still not a medical device, still not therapy.
- Roman Urdu clinical copy needs a separate native-language clinical reviewer before that locale ships.
