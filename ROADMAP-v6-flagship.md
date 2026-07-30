# SoulCap — v6 Flagship Roadmap ("surprise me, fully professional")

> The complete plan to take SoulCap from good-offline-PWA to a **flagship, clinician-approvable,
> App-Store-ready** private mental-health app. Companion to `SPEC-v6.0-production.md` (the build
> spec) — this file is the **north star + full phase map**. Cursor executes; run as a loop, one
> phase fully, verify, bump, doc, gallery, commit, push, next.

**Current:** v7.0.13 · Quiet Depth (SPEC-v7) + SPEC-v6.0 shipped · Vanilla ES5 offline PWA in `docs/` · localStorage only · ZERO network after load.
**Bar:** a therapist/psychiatrist sees it and is impressed, not merely tolerant. An App Store reviewer
approves without a rejection round.

---

## 0. Owner decisions locked (2026-07-27)

1. **Disclaimer placement.** Remove the repeated per-sheet "not yet clinically reviewed" banners from
   every screen. Consolidate into ONE calm home: an **About / Legal** section (see Phase 9). A single,
   honest "SoulCap is a self-guided wellness companion — not therapy, diagnosis, or medical advice"
   line stays there. This is non-negotiable for App-Store honesty and user safety; it is NOT a
   clinical-review claim and does not imply oversight. When a licensed clinician signs off, the About
   copy softens further, but a "not a medical device" line always remains.
2. **Delete weak themes.** Keep Auto · Light · Dark · Night · AMOLED · Ocean · Forest. Delete Rain,
   Space, Sunrise, Minimal. Accents → 3.
3. **Worth-returning-to, NOT addictive.** No streak pressure, no variable-reward hooks, no dark
   patterns. Success = the user needs the app less.
4. **Build all depth:** self-concept (H1), pattern engine (H2), habits (H3), plus everything below.
5. **Visuals: professional only.** WebGL/canvas/SVG motion that feels like Apple / Linear / Arc —
   restrained, physical, purposeful. No cheesy, bouncy, "stupid" animation. Motion always respects
   reduced-motion and the Still/Balanced/Vivid preset.

---

## 1. Design north star

**Feeling:** a quiet, premium, trustworthy companion. Calm > flashy. Every screen earns its space.
**References (for feel, not copying):** Apple Health/Mindfulness, Linear, Arc, Notion, Oak/Calm's
restraint, Things 3 density, Stripe's clarity.

**Design principles**
- One idea per screen. 3–4 things above the fold, never 1½ giant cards.
- Serif = the app's voice (speaking to you). Sans = chrome (labels, controls).
- Motion has physics and meaning; nothing decorative-only. Reduced-motion parity is mandatory.
- Colour is calm and few. Contrast is AA everywhere, ≥7:1 on safety + breathing copy.
- Nothing lies: no fake data, no fake streaks, no claims reality doesn't back.

---

## 2. Phase map (run in order; each is a loop iteration)

### FOUNDATION (health + truth)
- **P1 — Audit.** `AUDIT-v6.md`: map every render/sheet fn in app.js (+sizes), dead code, unused
  tokens/exports, console.logs, naming drift, top-10 risks. No code.
- **P2 — Code health.** Section + function-index app.js (stays one file, becomes navigable). Remove
  dead code/logs/dupes. One name per concept. Verify sw.js ASSETS == what index.html loads.
- **P3 — Disclaimer consolidation.** Remove per-sheet review banners. Build About/Legal home (Phase 9
  detail). Keep the single honest not-medical line there. Update SAFETY.md to match.

### STRUCTURE (layout, input, system)
- **P4 — Journal void fix.** Editor = flex column: header fixed · body `flex:1` fills all space ·
  toolbar pinned, keyboard-safe (`env(safe-area-inset-bottom)`). Ruled lines fill the writing area.
  No void at any entry length.
- **P5 — Density + card system.** Density tokens (`--pad-card`, `--gap-section`, `--tile-min`). Hero
  ≤~200px, standard tiles ~2 lines + action, list rows ~56px. Apply app-wide. Grid 4/8/12/16.
- **P6 — Keyboard/scroll/focus.** Autofocus only where the user came to type (journal body, park a
  thought). No autofocus on onboarding, settings, browsing, Now, Calm, chip/screener/path steps.
  Active field stays visible; toolbar above keyboard; no jump on blur. Momentum scroll.
- **P7 — Safe-area + chrome.** Header + tab bar pinned, safe-area padded, never overlap content or
  keyboard. FAB never covers a tile (keep regression test green). Notch/Dynamic Island/home-indicator.

### SYSTEM POLISH
- **P8 — Design tokens unified.** One set for colour/space/radius/border/elevation/type/motion. Kill
  hardcoded px/hex. Every component (button/chip/input/toggle/segmented/card/tile/sheet/row/empty/
  notice/red-flag) has all states (rest/press/focus-visible/selected/disabled) in every theme.
- **P9 — Theme cull + Settings redesign.** Delete Rain/Space/Sunrise/Minimal + their tokens/gallery.
  Keep 7 themes, 3 accents. Appearance screen = calm + short: theme swatches, accent, one "Ambient"
  row (Ocean · Forest). Move density/contrast/transparency/motion under an **Accessibility** group.
  Add **About / Legal** here: what SoulCap is, the single honest not-medical line, privacy ("stays on
  this device, no account, no network"), version, credits, licenses.
- **P10 — Theme parity + contrast.** Every screen in every mode: nothing blends, AA everywhere, ≥7:1
  breathing countdown + safety copy. Fix regressions from the cull.
- **P11 — Typography pass.** One scale, balanced headings, ≥15px body, consistent label spacing,
  rhythm. Serif/sans roles enforced.

### EXPERIENCE (the wow, done tastefully)
- **P12 — Signature moments (professional motion).** A small number of high-craft moments:
  the breathing orb (WebGL, already vendored) refined; a calm entrance/exit via View Transitions;
  physical press feedback; a considered empty-state per surface. All respect reduced-motion + preset.
  No confetti, no bounce, no gimmicks.
- **P13 — Onboarding as a first impression.** Warm, few steps, no autofocus, no country ask, 18+ gate
  gentle, Help reachable before consent. Sets voice tone from the first screen.
- **P14 — Now / Calm / You / Journal / Constellation** each get a distinct composition (not one shared
  sheet). Bento hero + rails + rows as fits each tab's job. Kill the "98% same" feeling.

### DEPTH (the psychology)
- **P15 — H1 Self-concept.** "Two versions of you": how I feel inside vs how I come across, per life
  area (work/family/friends/online); a per-area **mask-effort** slider (user's own rating). Framed as
  insight, never diagnosis, never a score. Gentle reflection surfacing overlap vs divergence + "how
  much energy does keeping that up take?"
- **P16 — H2 Pattern engine (non-diagnostic).** From the user's OWN local data, surface gentle,
  evidence-linked observations ("you've often noted low energy on evenings after little sleep") with a
  confidence level and one-tap correction. Never asserts a disorder. Never leaves the device. Trust-
  tier model: estimates with confidence, always correctable.
- **P17 — H3 Habits support.** Habit-loop (cue → routine → reward) mapping + urge-surfing tool.
  Supportive, non-judgemental, no streak pressure, no shame.
- **P18 — Reflection screeners refined.** PHQ-9/GAD-7 stay reflection-not-diagnosis; item-9 → Help;
  no severity labels as verdicts. Softer framing, clearer "this is a mirror, not a diagnosis."

### QUALITY GATES
- **P19 — Accessibility (clinician/reviewer grade).** Full VoiceOver labels/roles/focus order on
  Panic/Runner/Screener/Journal/sheets; Dynamic Type 200% no clip; reduced-motion parity; ≥48px
  targets; visible focus; semantic roles. Add tests.
- **P20 — Performance + offline integrity.** Cold start fast; no jank on scroll/motion; WebGL degrades
  on weak devices (capability probe); sw.js precache correct; full offline works; no memory leaks.
- **P21 — Final QA.** Break everything: offline, long text, 200% type, rapid nav, edge states. All
  Playwright + safety tests green. Gallery regenerated. Version fields aligned, docs current.

---

## 3. Non-negotiable guardrails (inherit in every phase)

- ZERO network after load. No CDN/fonts/analytics/LLM. Offline stays perfect.
- Safety kernel (assessRisk 0–3), hard-coded number-free Help, 18+ gate: never weakened. Keep
  docs/app.js and backend safety-gate.service.ts in sync if touched.
- No crisis phone numbers, no country picker. Number-free, country-agnostic guidance only.
- ES5 only. el()/$()/clear() the only DOM primitives. No new libraries. Vendor frozen except as SPEC
  allows.
- Worth-returning-to, NOT addictive. Success = needing the app less.
- Honesty: About/Legal keeps a not-medical line always. No diagnosis claims, no clinical-proof claims.

## 4. Definition of done (STOP condition)

STOP only when P1→P21 are all implemented, verified (`npm run verify` green), versioned (package.json
+ sw.js CACHE + VERSION.json + APP_VERSION all match), documented (CHANGELOG/SAFETY/HANDOVER),
gallery regenerated, committed and pushed. Then print a per-phase report + final version, and stop.

---

## 5. v6.1 — "In-therapy" companion track (owner request 2026-07-27)

Onboarding gains a private, changeable question: **"Are you currently working with a therapist or
counsellor?"** (Yes / No / Prefer not to say). It sets a local `careContext` flag only — no account,
no network, never shared, fully reversible in Settings. When Yes, unlock a **Therapy Companion** set.
All of it stays non-diagnostic, no crisis numbers, no addiction mechanics; SoulCap positions itself as
the *space between sessions*, never a replacement for the clinician.

- **P22 — Care-context flag + gentle fork.** The onboarding question + Settings toggle. Copy adapts:
  in-therapy users see "a place to work between sessions"; others see the standard companion framing.
- **P23 — Between-sessions journal.** A dedicated log the user can bring to a session: what happened,
  moods, triggers, wins, questions-for-my-therapist. One-tap "Prepare for my session" view that
  gathers the last N days into a calm, readable summary the user can read aloud or screenshot. Local
  only; export is user-initiated share via OS, never automatic.
- **P24 — Homework / practice tracker.** Therapists assign between-session practice (thought records,
  exposure steps, behavioural-activation tasks). Let the user add their OWN practice items (free text
  or from the existing technique library), mark done gently — NO streak pressure, NO adherence score,
  NO nagging. "Did you get to it?" not "you broke your streak."
- **P25 — Thought records (CBT worksheet).** Structured situation → automatic thought → evidence for/
  against → balanced thought → mood re-rating. The single most-assigned CBT tool; pairs with the
  existing safety kernel on free text. Non-diagnostic, saved locally, addable to the session summary.
- **P26 — Questions-for-my-therapist parking lot.** Quick capture of things to raise next session, so
  they aren't forgotten. Surfaces in the "Prepare for my session" view.
- **P27 — Session rhythm (opt-in, pressure-free).** User can note their session cadence (e.g. weekly)
  purely to time the "prepare" prompt — a quiet, dismissible nudge the day before, never guilt, never
  a reminder they "missed" anything. Off by default.
- **P28 — Coping-plan / safety-plan bridge.** Let the user record, in their own words, the plan they
  built WITH their therapist (warning signs, coping steps, people/places that help). Lives beside the
  existing hard-coded Help so it's reachable in a hard moment. Never replaces Help; augments it.
- **P29 — Boundaries copy pass.** Everywhere the companion track appears, the app is explicit: it does
  not talk to the therapist, send anything anywhere, or give clinical advice; it holds the user's own
  material between sessions. About/Legal states this plainly.

Guardrails unchanged (section 3). `careContext` is local, optional, reversible; all new surfaces are
user-authored content assessed by the existing keyword kernel; nothing is diagnosis; no data leaves
the device.
