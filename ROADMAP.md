# SoulCap — Roadmap

Detailed, build-ready roadmap. Written so another agent (e.g. Cursor Composer) can pick up any
item and ship it **the same way the rest of the app was built** — read `AGENTS.md` first for the
rules, conventions, and ship workflow. Every item below lists **what**, **why**, **files to
touch**, **acceptance criteria (incl. a test)**, and **guardrails**.

**Current release: v5.0.6** · Published app: https://shamikhahmed.github.io/SoulCap/

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
2. Roman Urdu clinical-copy reviewer + localisation (LTR chrome preview ships; clinical English until review).
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

## v1.8 — Safety pass + Roman Urdu expansion — shipped 2026-07-22

- [x] Tier-3 Help on all free-text surfaces (journal, history, safety plan, park, person notes, manual, principles).
- [x] ES5 `data.js`, dead code cleanup, a11y tokens, expanded Roman Urdu chrome, Playwright safety tests.
- SW `soulcap-v180`.

## v1.9 — Clinical content library — SHIPPED 2026-07-23 (v1.9.3)
Spec: [`SPEC-v1.9-clinical-library.md`](SPEC-v1.9-clinical-library.md). Delivered across PR-1…5:
- [x] Flaky theme/journal e2e stabilised.
- [x] 24-experience library (physical + cognitive): what it is · why · what helps (0 broken skill
  links) · self-care · reflection · red-flags. Searchable, with detail sheets.
- [x] "What's happening?" experience picker on Now + Calm → matched experience → skill.
- [x] Fight/flight + wind-down ("no work after 7pm") articles with an optional wind-down hour.
- [x] PHQ-9 + GAD-7 reflection screeners, "not a diagnosis" framing, PHQ item-9 → Help routing.
- Schema **v11** · SW `soulcap-v193`.

### v2.0 Premium polish · **build guide: [`SPEC-v2.0-premium-polish.md`](SPEC-v2.0-premium-polish.md)**
- [x] **PR-1 IA** — You: About / Insights / Tools; Now primary+quiet; Calm guided-first + “Also here”.
- [x] **PR-2–6 craft** — tokens/components, microcopy/SETTINGS_UI, empties + What’s new, haptics,
  About + journal shortcut, clinical sheet polish, gallery refresh.
  App **2.0.1** · SW `soulcap-v201`.

Craft only — **not more features**. Rubric + checklist in the spec.

### IN PROGRESS — v4.0 Master design · **[`SPEC-v4.0-master-design.md`](SPEC-v4.0-master-design.md)**
- [x] **PR-1 Foundations** — type/spacing/radii/motion + composition kit · **4.0.0** / `soulcap-v400`
- [x] **PR-2 Router** — pushView stack + back · **4.0.1** / `soulcap-v401`
- [x] **PR-3 Now** — hero band + bento · **4.0.2** / `soulcap-v402`
- [x] **PR-4 You** — dashboard + list rows + pushViews · **4.0.3** / `soulcap-v403`
- [x] **PR-5 Calm** — hero + rails · **4.0.4** / `soulcap-v404`
- [x] **PR-6 Journal + People** — book depth + edge map · **4.0.5** / `soulcap-v405`
- [x] **PR-7 Focused flows** · **4.0.6** / `soulcap-v406`
- [x] **PR-8 First run** · **4.0.7** / `soulcap-v407`
- [x] **PR-9 Copy pass** · **4.0.8** / `soulcap-v408`
- [x] **PR-10 States + a11y + gallery** · **4.0.9** / `soulcap-v409`
- **v4.0 complete.**

### IN PROGRESS — v5.0 Native motion · **[`SPEC-v5.0-native-motion.md`](SPEC-v5.0-native-motion.md)**
- [x] **PR-1 Motion foundation** — GSAP vendor + `data-motion` + probe · **5.0.0** / `soulcap-v500`
- [x] **PR-2 View Transitions** · **5.0.1** / `soulcap-v501`
- [x] **PR-3 Gestures** · **5.0.2** / `soulcap-v502`
- [x] **PR-4 Breathing orb** · **5.0.3** / `soulcap-v503`
- [x] **PR-5 Signature moments** · **5.0.4** / `soulcap-v504`
- [x] **PR-6 Depth** · **5.0.5** / `soulcap-v505`
- [x] **PR-7 Onboarding preset** · **5.0.6** / `soulcap-v506`
- [ ] PR-8 Perf/a11y

### Then — v5.0 Native motion · **[`SPEC-v5.0-native-motion.md`](SPEC-v5.0-native-motion.md)**
- [ ] PR-1…8 (GSAP vendored, View Transitions, gestures, breathing orb, signatures…)

### Shipped — v3.0 Amethyst redesign · **[`SPEC-v3.0-redesign.md`](SPEC-v3.0-redesign.md)**
- [x] **PR-1 tokens** — Amethyst palette, elevation, grain, FAB clearance · **3.0.0** / `soulcap-v300`
- [x] **PR-2–7** — component kit · Now hero + Explore · welcome/onboard · Progress dash · approach
  packs · gallery · **3.0.1** / `soulcap-v301`

### Shipped — v2.1 Guided Path · **[`SPEC-v2.1-guided-path.md`](SPEC-v2.1-guided-path.md)**
- [x] Feeling → chips → family why → exercise (rule-based, offline). Sister reply + review kit.
- [x] Schema **v12** · SW `soulcap-v210` · app **2.1.0** · e2e path / Help / no-diagnosis lexicon.

### After v3.0
- [`SPEC-v2.3-regulation-depth.md`](SPEC-v2.3-regulation-depth.md) — deeper regulation tools.
- `SPEC-v2.2-approach-packs.md` — its recommendation engine is now built inside v3.0 §4; keep the
  spec for the distortion-lens / thought-record wizard detail.

### Later (post-2.2)
- Encrypted optional local backup (passphrase) — lost phone ≠ lost journal.
- Broader Roman Urdu chrome (editor / person sheets) still preview; clinical English until review.
- Quiet Wins deferred (manipulative risk).
- IndexedDB only if localStorage quota pain appears in the wild.

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
