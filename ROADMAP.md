# SoulCap — Roadmap

Detailed, build-ready roadmap. Written so another agent (e.g. Cursor Composer) can pick up any
item and ship it **the same way the rest of the app was built** — read `AGENTS.md` first for the
rules, conventions, and ship workflow. Every item below lists **what**, **why**, **files to
touch**, **acceptance criteria (incl. a test)**, and **guardrails**.

**Current release: v1.7.0** · Published app: https://shamikhahmed.github.io/SoulCap/

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
2. Roman Urdu clinical-copy reviewer + localisation (LTR preview ships; clinical English until review).
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

## v0.9 — Understand yourself — shipped 2026-07-22

- [x] **Schema v6 migration:** legacy check-ins receive stable IDs and optional detail fields;
  migration write failure leaves the original stored payload untouched.
- [x] **Optional detailed check-ins:** five skippable dimensions, a direct need, and optional
  trigger tags behind the unchanged one-tap arrival words. Same-day dedup remains.
- [x] **Explainable adaptation:** the direct need affects recommendations and is named in the
  reason; no private journal text is mined.
- [x] **Evidence-backed patterns:** at least five distinct check-in days before analysis and at
  least three distinct supporting days before a pattern appears. Evidence is inspectable;
  confirm, reject, hide, and global off controls persist locally.
- [x] **Seven-day summary:** factual counts and dimension averages only; no score, streak,
  causation, or diagnosis.
- [x] **Presentation controls:** purple-family accents, text size, density, higher contrast, and
  reduced transparency remain independent from light/dark/night.
- [x] **Safety and reliability:** atomic check-in rollback, local tier-3 routing for the short
  check-in phrase, 152 mobile + desktop checks, and no network additions.

---

## v1.0 — Trust, reach, validation — shipped 2026-07-22

- [x] **Offline emotional library:** six searchable articles with practical options, reflection,
  support guidance, references, review-status honesty, and stable skill links.
- [x] **No-streak daily supports:** optional local-day completion only; no streaks, badges,
  points, red counts, guilt, or notifications.

---

## v1.1 — Adaptive reach and access — shipped 2026-07-22 (1.1.5 still gated)

### 1.1.1 — Adaptive questionnaire engine · **SHIPPED**
- Tiny drip sessions (cap 4/day), branching from prior answers, gradual estimates with confidence.
  Viewable/correctable in “What SoulCap knows”; never diagnoses.

### 1.1.2 — Themes & modes · **SHIPPED**
- Ocean / Forest / Rain / Space / Sunrise / Minimal / AMOLED plus Auto/Light/Dark/Night.

### 1.1.3 — Accessibility audit · **SHIPPED (automated slice)**
- Panic + runner dialog semantics and 200% zoom smoke tests. Reduced-motion and token contrast
  remain. Manual SR pass still welcome before store claims.

### 1.1.4 — Locale scaffold · **SHIPPED (Roman Urdu LTR preview in v1.4)**
- English + Roman Urdu (`rui`) LTR preview. Clinical/safety English stays until native
  clinical-copy review. Arabic-script/RTL Urdu removed.

### 1.1.5 — Clinician-reviewed technique set · **(non-code, gates the banner)**
- Record sign-off per technique; only then remove the "not yet clinically reviewed" banner in
  `renderSkills`.

---

## v1.2 — Constellation polish — shipped 2026-07-22

- [x] **Pinch add/remove rings** (3–7) with accessible chip fallback; outer people remapped.
- [x] **Long-press rename** on ring labels (sheet still available).
- [x] **Opt-in node size** from logged speak frequency — never importance.
- [x] **Safety-plan pull** of supportive Constellation people into “People I can tell”.

---

## v1.4 — Reflection foundations — shipped 2026-07-22 (bundles 1.2.2 + 1.3 + 1.4)

- [x] Greeting late until 06:00; Settings sheet off You; map pace Still/Drift/Live + inertia/glow.
- [x] Personal Reset Menu, Thought Parking, Pattern Confidence labels.
- [x] Emotional Timeline, Gentle Reflection Cards, richer emotion vocabulary, Principles list.
- Schema **v9** · SW `soulcap-v140`.

## v1.5 + v1.6 — Personal Manual & quiet refinement — shipped 2026-07-22

- [x] Personal Manual v1: templates from confirmed patterns, principles, reset usage; edit/add/remove/refresh.
- [x] First-week empty states; library bookmarks; journal search (mood/feeling/parked); constellation depth; a11y labels; panic plan link.
- Schema **v10** · SW `soulcap-v160`.

## v1.7 — Premium polish + Roman Urdu chrome — shipped 2026-07-22

- [x] Motion/spacing tokens, softer cards/sheets, deep dark + AMOLED surfaces, reduced-motion opacity-only.
- [x] Roman Urdu chrome for tabs, settings, empty states, reset/park, pattern labels, map pace; clinical English notice once.
- SW `soulcap-v170`.

### Next (v1.8+)
- Quiet Wins deferred (manipulative risk).

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
- Shipped in v1.2.0 (pinch rings, long-press rename, frequency sizing, safety-plan pull).

## Notification strategy (when native lands)
- Never guilt. Examples: "Take one slow breath." · "Your journal is here whenever you're ready."
- Off by default; user picks tone + frequency; never engagement-timed.

## Done-gate for every item
Reduces stress? Evidence-informed? Calming? Simple? Private (no network)? Honest about limits?
Accessible? Has a test if safety-critical? Would Apple ship it? If not — not done.
