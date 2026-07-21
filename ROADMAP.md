# SoulCap — Roadmap

Detailed, build-ready roadmap. Written so another agent (e.g. Cursor Composer) can pick up any
item and ship it **the same way the rest of the app was built** — read `AGENTS.md` first for the
rules, conventions, and ship workflow. Every item below lists **what**, **why**, **files to
touch**, **acceptance criteria (incl. a test)**, and **guardrails**.

**Current: v0.8.1** · Live: https://shamikhahmed.github.io/SoulCap/

Philosophy (never drifts): a personalised emotional operating system, **not** an AI therapist.
Help people understand and regulate; never "fix" them; never diagnose; success = needing the app
less. See `AGENTS.md §2` for the hard rules — every item inherits them.

---

## Legend
- **Effort:** S (hours) · M (a day) · L (multi-day).
- Each item is independently shippable and must leave the app green (`npm run verify`) and the
  cache bumped (`AGENTS.md §6`).

## The three non-code blockers (gate any "it helps" claim)
1. Licensed clinician reviews the techniques → then remove the "not yet reviewed" banner.
2. Urdu clinical-copy reviewer + localisation.
3. (No crisis lines ship, per owner — so no re-verification needed unless that reverses.)

---

## v0.8 — Journal as a full book — shipped 2026-07-21

- [x] **Voice transcription:** appends speech only when `SpeechRecognition` verifies local
  processing and an existing on-device language pack. No remote/webkit fallback, language-pack
  download, or audio storage. Unsupported devices keep ordinary writing available.
- [x] **Journal templates:** blank plus seven optional starting structures.
- [x] **Photo cover + contents:** down-scaled local cover photo, month grouping/navigation, and
  title/body search.
- [x] **Per-entry decoration:** opt-in washi edge or folded corner.
- [x] **Reliability/a11y:** failed media saves restore prior state; journal controls meet 48px;
  mobile and desktop Playwright coverage.

---

## v0.9 — Understand yourself (the intelligence, done safely)

> Central rule for this whole version: everything the app infers is a **low-confidence estimate
> the user can see and correct** (trust tiers — see the vault's `SoulCap-Adaptive-Engine.md`).
> Show correlations as gentle observations, never verdicts. **Never diagnose.**

### 0.9.1 — Multi-dimensional check-in · **M**
- **What:** replace the single mood word (optionally) with a few sliders: energy, calm, stress,
  hope, connection, focus. Store per check-in.
- **Why:** How-We-Feel / Daylio-grade emotional granularity; feeds patterns without labels.
- **Files:** `data.js` (`CHECKIN_DIMENSIONS`), `app.js` (`renderNow` check-in UI + `recordCheckin`
  stores a `dims` object; keep the quick word check-in as the default, sliders behind "add detail"),
  `app.css` (slider styling using `--accent`).
- **Accept:** check-in still one-tap by default; detailed mode stores dimensions; **dedup per day
  still holds** (see `recordCheckin`); test asserts two same-day check-ins don't stack.

### 0.9.2 — Trigger tracking · **M**
- **What:** optional "what's going on?" tags on a check-in (work, sleep, money, social, family,
  health, weather, deadlines…). Local, optional.
- **Files:** `data.js` (`TRIGGERS`), `app.js` (check-in flow + storage).
- **Accept:** tags optional and skippable; stored on the check-in; no nagging if skipped.

### 0.9.3 — Pattern detection (gentle) · **M–L**
- **What:** surface simple, honest correlations over weeks ("evenings have been harder lately";
  "you've felt steadier on days you moved"). Deterministic, explainable, in the **Journey**/You
  area.
- **Files:** `app.js` (a `patterns()` function over `checkins`/`skillRuns`; render in `renderMe`).
- **Accept:** phrasing is tentative and observational; every surfaced pattern is derivable from
  stored data (no black box); shows nothing until there's enough data. **Guardrail:** never state
  causation or a diagnosis; always "seems", "lately", "some people".

### 0.9.4 — Emotional summaries · **M**
- Weekly + monthly reflection: mood/dimension trends, top techniques that helped, most peaceful
  days, journal count. No score, no rating, no streak. Lives in You/Journey.

### 0.9.5 — Emotional library · **M**
- **What:** short, evidence-informed articles (anxiety, panic, burnout, grief, loneliness,
  overthinking, sleep, boundaries, self-esteem, anger…). Each: what it is · common experiences ·
  practical coping · reflection questions · **when to seek professional support** · references.
- **Files:** `data.js` (`ARTICLES = [{id,title,body sections,related skill ids}]`), a browsable
  surface inside Calm (or a Library entry). Link relevant techniques.
- **Accept:** every article ends with a "when to seek help" section; no article claims to treat or
  diagnose; content authored from public/evidence-informed sources with a citation line.

### 0.9.6 — Micro-habits · **S–M**
- Tiny, optional habits (water, walk, sunlight, call someone, journal). Gentle completion, **no
  streaks/scores**. Store per-day booleans.

---

## v1.0 — Trust, reach, validation

### 1.0.1 — Adaptive questionnaire engine · **L**
- **What:** replace any long questionnaire with many tiny sessions (5 today, 4 tomorrow), questions
  adapting to prior answers. Feeds a **user model** of *estimates with confidence* (stress,
  burnout, resilience, sleep…) that update gradually, never abruptly.
- **Files:** `data.js` (question bank + branching), `app.js` (a scheduler + a bounded estimator),
  vault spec `SoulCap-Adaptive-Engine.md` (trust tiers) is the contract.
- **Accept:** never more than a handful of questions at once; every estimate shows a confidence and
  is user-viewable/correctable in "What SoulCap knows"; **no field is presented as a diagnosis.**

### 1.0.2 — Themes & modes · **M**
- Ocean / Forest / Rain / Space / Sunrise / Minimal, plus AMOLED-black. All as `[data-theme]`
  token blocks in `app.css`; picker in settings. Keep contrast + reduced-motion intact.

### 1.0.3 — Accessibility audit · **M**
- Screen-reader pass on panic + runner; 200% text; reduced-motion; colour-blind-safe check both
  themes. Add tests where assertable (contrast, target size already covered — extend).

### 1.0.4 — Urdu localisation · **L**
- Full, reviewed by a native speaker with clinical context. String-extract first; RTL-safe layout.

### 1.0.5 — Clinician-reviewed technique set · **(non-code, gates the banner)**
- Record sign-off per technique; only then remove the "not yet clinically reviewed" banner in
  `renderSkills`.

---

## Later — bigger bets (each needs its own safety review before starting)

- **On-device journal analysis** — extract emotions/topics/patterns from free writing and surface
  gently. On-device only. Never label the person.
- **Companion chat (LLM)** — the highest-risk surface. Only behind a real eval harness + a
  classifier kernel (see vault `SoulCap-Eval-Harness.md`). **Never ships before the adversarial
  suite exists.** Requires network → would break the offline-only guarantee; treat as a separate
  product mode, opt-in, clearly bounded.
- **Kernel v2** — a classifier that catches *oblique* risk ("I've been sorting out my things")
  that the keyword list misses. Prerequisite for any generative text.
- **Shared engine package** — extract safety + skills into `packages/soulcap-engine` so the PWA and
  the Nest backend stop maintaining two hand-synced keyword lists.
- **Native app (Expo)** — real notifications, background reminders, richer haptics, wearable
  heart-rate in panic mode. Revives `mobile/`.
- **Clinician panel** (Nest, Clerk THERAPIST-gated) with a decision-trail audit. Already designed.
- **Encrypted optional sync/backup** — explicit opt-in, so a lost phone isn't a lost journal.

---

## Constellation polish
- Pinch to add/remove rings; long-press to rename inline.
- Node size = interaction frequency (opt-in; never "importance").
- Constellation → safety-plan link: pull "people I can tell" straight from the map.

## Notification strategy (when native lands)
- Never guilt. Examples: "Take one slow breath." · "Your journal is here whenever you're ready."
- Off by default; user picks tone + frequency; never engagement-timed.

## Done-gate for every item
Reduces stress? Evidence-informed? Calming? Simple? Private (no network)? Honest about limits?
Accessible? Has a test if safety-critical? Would Apple ship it? If not — not done.
