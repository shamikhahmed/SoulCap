## [Unreleased]

## [5.1.4] — 2026-07-24

### Fixed
- **Layout regression:** remove `--fab-gutter` (120px right padding emptied the column on
  iPhone 16 Pro Max). Views use symmetric `var(--space-4)` again. FAB off on Now/You
  (header Help); icon-only FAB ≤480px on Calm/Journal/Map. Playwright mobile viewport
  **430×932**. Symmetry + FAB-placement tests.
- SW `soulcap-v514`. App **5.1.4**. Schema still **v12**.

## [5.1.3] — 2026-07-24

### Fixed
- **v5.1 PR-4 FAB / ship hygiene:** mobile `--fab-gutter` so Help never covers cards/tiles;
  larger `--fab-clearance`; hero→section gap tightened to 48px; `package.json` version synced;
  ship workflow lists `package.json` in AGENTS.md / `.cursorrules`.
  *(Superseded by 5.1.4 — gutter emptied the layout; replaced by hide-FAB + icon-only.)*
- SW `soulcap-v513`. App **5.1.3**. Schema still **v12**. **v5.1 complete.**

## [5.1.2] — 2026-07-24

### Changed
- **v5.1 PR-3 Settings controls:** real `role="switch"` toggle rows (no On/Off in label);
  theme 2-column swatch grid; exclusive choices use rect `seg-opt` (not pill+rect mix);
  export/About as list rows; destructive Delete stays a danger button.
- SW `soulcap-v512`. App **5.1.2**. Schema still **v12**.

## [5.1.1] — 2026-07-24

### Changed
- **v5.1 PR-2 Rhythm:** phase label is largest/highest-contrast with calm swap; depleting
  progress arc around orb; default pace **Slow** (1.35); Slow/Steady/Brisk inside runner +
  breath setup; timing tests for box-breathing / 4-7-8 / step ≥9s.
- SW `soulcap-v511`. App **5.1.1**. Schema still **v12**.

## [5.1.0] — 2026-07-24

### Fixed
- **v5.1 PR-1 Breathing visibility:** countdown uses `--ink` (not accent); orb keeps a filled
  accent-soft body under WebGL; ring opacity ~0.5 / stroke ≥2px; stronger WebGL fill. Panic
  layout unchanged (contrast only).
- SW `soulcap-v510`. App **5.1.0**. Schema still **v12**.

## [5.0.7] — 2026-07-24

### Changed
- **Native motion PR-8 Perf + a11y:** visibility pause hook for orb canvas; What’s new copy for 5.0;
  gallery regen. **v5.0 native motion complete.**
- SW `soulcap-v507`. App **5.0.7**. Schema still **v12**.

## [5.0.6] — 2026-07-24

### Added
- **Native motion PR-7 Onboarding preset:** “How much movement feels right?” (Vivid /
  Balanced / Still) after consent; Settings Movement chips already ship. Reduced-motion still wins.
- SW `soulcap-v506`. App **5.0.6**. Schema still **v12**.

## [5.0.5] — 2026-07-24

### Added
- **Native motion PR-6 Depth:** hero-band parallax + vivid glow drift; constellation edge
  vignette; rail `content-visibility`. Still / reduced-transparency mute blur & drift.
- SW `soulcap-v505`. App **5.0.5**. Schema still **v12**.

## [5.0.4] — 2026-07-24

### Added
- **Native motion PR-5 Signature moments:** splash GSAP breathe; check-in chip spring + hero hue
  ripple; path result reveal; progress dots draw-in; journal paper open. Still skips all.
- SW `soulcap-v504`. App **5.0.4**. Schema still **v12**.

## [5.0.3] — 2026-07-24

### Added
- **Native motion PR-4 Breathing orb:** hand-written WebGL soft sphere
  (`docs/vendor/breath-orb.js`), drives Runner + Panic pacer breath timing.
  Fallback ladder: no WebGL / Still / reduced-motion → existing CSS orb.
- SW `soulcap-v503`. App **5.0.3**. Schema still **v12**.

## [5.0.2] — 2026-07-24

### Added
- **Native motion PR-3 Gestures:** swipe between tabs; drag-down dismiss sheet (rubber-band);
  edge swipe-back on pushed subviews. Still disables gestures. Panic/Runner/Editor stay
  gesture-free for safety.
- SW `soulcap-v502`. App **5.0.2**. Schema still **v12**.

## [5.0.1] — 2026-07-24

### Added
- **Native motion PR-2:** View Transitions API on push/pop/close subview (`withViewTransition`).
  Still / reduced-motion skip VT. `#subview` named transition pair.
- SW `soulcap-v501`. App **5.0.1**. Schema still **v12**.

## [5.0.0] — 2026-07-24

### Added
- **Native motion PR-1 foundation:** vendored GSAP core (`docs/vendor/gsap.min.js`, offline
  precache), `data-motion` presets (Vivid / Balanced / Still), capability probe, Settings Movement
  chips, haptics respect Still. Lazy-loads GSAP after first paint.
- Dependency rule updated in `AGENTS.md` / `.cursorrules` (vendor only, no CDN, no Three.js).
- SW `soulcap-v500`. App **5.0.0**. Schema still **v12**.

## [4.0.9] — 2026-07-24

### Changed
- **Master design PR-10 States + a11y:** shared `emptyState` kit; warmer empties for Journal /
  People / Patterns / knows; rails keyboard-focusable with labelled See all; hero-band contrast.
- SW `soulcap-v409`. App **4.0.9**. Schema still **v12**. **v4.0 master design complete.**

## [4.0.8] — 2026-07-24

### Changed
- **Master design PR-9 Copy pass:** one word = **technique** (was skill/exercise in UI).
  Strings centralized via `*_UI` / STRINGS; Runner aria-label “Technique”. Safety copy untouched.
- SW `soulcap-v408`. App **4.0.8**. Schema still **v12**.

## [4.0.7] — 2026-07-24

### Changed
- **Master design PR-8 First run:** Splash gradient+grain + ambient breath; Welcome full-bleed
  lockup with Help as quiet text link; Onboarding slim progress bar + Help in header, one step
  per screen.
- SW `soulcap-v407`. App **4.0.7**. Schema still **v12**.

## [4.0.6] — 2026-07-24

### Changed
- **Master design PR-7 Focused flows:** Path + Screener run as full-screen `#sheet.flow` (one step at a time).
  Panic/Runner ambient polish. Panic stays plainest surface.
- SW `soulcap-v406`. App **4.0.6**. Schema still **v12**.

## [4.0.5] — 2026-07-24

### Changed
- **Master design PR-6 Journal + People:** full-bleed book cover (spine/edge), paper-slip
  timeline; edge-to-edge constellation with glass-pill controls.
- SW `soulcap-v405`. App **4.0.5**. Schema still **v12**.

## [4.0.4] — 2026-07-24

### Changed
- **Master design PR-5 Calm:** hero-band need picker; rails Fitted for you · Understand · Read;
  quiet Also-here list rows (path / library / notice / supports / reset). Browse-all kept.
- SW `soulcap-v404`. App **4.0.4**. Schema still **v12**.

## [4.0.3] — 2026-07-24

### Changed
- **Master design PR-4 You:** hero-band profile header, progress hero-tile, 3 stat tiles
  (Patterns · Weekly · Timeline), list-row groups for tools / about / settings.
- Pushed subviews: My plan, Your story, Profile, Personal manual, Principles, Timeline,
  Patterns (+ evidence), What SoulCap knows. Settings + About stay sheets.
- SW `soulcap-v403`. App **4.0.3**. Schema still **v12**.

## [4.0.2] — 2026-07-24

### Changed
- **Master design PR-3 Now:** hero-band (date + greeting + arrival chips) → hero-tile suggestion →
  2-up utility (This week · Short path) → micro row (notice what’s happening · wind-down) →
  quiet Explore (drip + connect). Kit classes end-to-end.
- SW `soulcap-v402`. App **4.0.2**. Schema still **v12**.

## [4.0.1] — 2026-07-24

### Added
- **Master design PR-2 Router:** `pushView` / `popView` / `closeSubview` stack with back,
  Escape, scroll restore; technique / experience / article details are pushed subviews (not sheets).

### Changed
- SW `soulcap-v401`. App **4.0.1**. Schema still **v12**.

## [4.0.0] — 2026-07-24

### Added
- **Master design PR-1 Foundations:** formal type scale (display→micro), spacing (incl. 20px),
  radii (lg 24 / xl 32), motion (160/260/420ms), composition kit CSS + helpers — `hero-band`,
  `hero-tile`, `tile`, `rail`, `list-row`, `stat-tile`, `glass-pill`, `nav-header`, `toast`,
  `#subview` host shell. Engines unchanged.

### Changed
- SW `soulcap-v400`. App **4.0.0**. Schema still **v12**.

## [3.0.1] — 2026-07-23

### Added
- **Progress dashboard** on You — week dots (not a streak), exercise/check-in/journal/path glance.
- **Approach packs** after Guided Path — CBT / DBT / ACT / behavioural-activation educational
  recommendation + linked exercises (runner). Warm why-copy; never diagnosis.

### Changed
- **Component kit** (SPEC §5): raised cards, opt/chip/input elevation, empty-state, seg, notice,
  tab bar surface polish.
- **Now** flagship: hero glow, raised suggestion, week progress glance, Explore folds path /
  experiences / wind-down / drip.
- **Welcome / onboarding**: larger mark + ambient glow; progress dots.
- SW `soulcap-v301`. App **3.0.1**. Schema still **v12**.

## [3.0.0] — 2026-07-23

### Changed
- **Amethyst design system (SPEC v3.0 PR-1):** dark-first refined violet tokens; cards elevate with
  lighter `--surface` + hairline + `--shadow-1` (dark no longer drops shadows); `--accent-grad`
  primary buttons (not neon glow); grain overlay; `--glow` / `.hero-glow`; sheet uses `--surface-2`;
  Help FAB clearance via `--fab-clearance` + view padding (never covers tab bar / last cards).
  Mood themes re-derived to same elevation story. Engines untouched.
- SW `soulcap-v300`. App **3.0.0**. Schema still **v12**.

## [2.1.0] — 2026-07-23

### Added
- **Guided Path** (sister brief, SoulCap-safe): optional short path on Now + Calm — arrival →
  symptom chips → plain-language exercise **family** why → Begin. Rule-based; never diagnoses;
  never prescribes CBT/DBT/ACT as treatment. Educational footnote only. Panic-like clusters offer
  Help + grounding. Sessions under What SoulCap knows (clearable). Hide card in Settings.
- Docs: `SPEC-v2.1-guided-path.md`, sister reply + review kit; later SPECs v2.2 / v2.3 parked.
- Playwright: Guided Path suite (complete path → runner, panic Help offer, knows clear, hide card,
  forbidden-lexicon scrub, schema migrate to v12).
- Gallery: `*-06-guided-path.png`; hub catalog + marketing shots refreshed.

### Changed
- Schema **v12** (`pathSessions`, `pathPrefs`). SW `soulcap-v210`. App **2.1.0**.
- Architecture / data-model / features / clinical / safety / handover / agents docs aligned to 2.1.0.

## [2.0.1] — 2026-07-23

### Changed
- **Premium polish (SPEC §2–9):** token/spacing consistency (cards, chips, buttons, stacks),
  designed empty states with CTAs, dismissible What’s new, About sheet, journal install shortcut,
  haptic language (`tick`/`select`/`done`/`open`), experience helps as skill cards, screener run
  spacing, FAB stroke aligned with tabs.
- SW `soulcap-v201`. App **2.0.1**. Schema still **v11**.

## [2.0.0] — 2026-07-23

### Changed
- **IA polish (craft only):** You tab grouped into About you · Your insights · Your tools (+ Settings).
  Timeline moved off Now onto Your insights. Now: greeting → check-in → one suggestion (primary),
  quieter secondary cards below. Calm: guided needs first; library / experiences / supports / reset
  under “Also here”.
- SW `soulcap-v200`. App **2.0.0**. Schema still **v11**.

## [1.9.3] — 2026-07-23

### Added
- **Reflection check** on You: opt-in PHQ-9 and GAD-7 style questionnaires (public domain).
  Reflection framing only — never a diagnosis. Results stored as low-confidence local signals
  (view/clear in What SoulCap knows); history kept as plain score/band lines.
- **Safety:** any PHQ-9 item-9 endorsement opens hard-coded Help; top-band totals show a
  professional-support nudge.

### Changed
- Schema **v11** (`screenerResults`). SW `soulcap-v193`. App **1.9.3**.

## [1.9.2] — 2026-07-23

### Added
- Library articles: **Your body’s alarm — fight, flight, freeze** and **Slowing down — boundaries
  and winding down** (not reviewed; professional-support sections).
- Optional **wind-down hour** in Settings (17:00–23:00 or Off). After that hour, Now shows a gentle
  no-guilt card (no notifications).

### Changed
- SW `soulcap-v192`. App **1.9.2**. Article count 8.

## [1.9.1] — 2026-07-23

### Added
- **What’s happening?** optional picker on Now and Calm → grouped experiences → detail → skill runner.
  Never forced; not a diagnosis.

### Changed
- SW `soulcap-v191`. App **1.9.1**.

## [1.9.0] — 2026-07-23

### Added
- **Clinical experiences library** (physical + cognitive): 24 searchable experiences with what/why/
  helps/self-care/reflection, linked to existing skills. Never diagnoses.
- **Red-flag panels:** `emergency` (crisis styling) and `seeDoctor` (caution token) — number-free,
  country-agnostic; general medical-check notice at top of Experiences.
- Library filters: All / Experiences / Articles / Saved; search matches experience `aka` terms.
- Playwright coverage for helps-id integrity, detail→runner, emergency panel, aka search.

### Changed
- SW `soulcap-v190`. App **1.9.0**. `--caution` tokens in all themes.
- Skill id note: SPEC `categories` → shipped `categories-game`.

## [1.8.0] — 2026-07-22

### Added
- **Safety pass:** tier-3 `assessRisk` now opens Help on journal save, history/safety-plan textareas (change/blur), parked thought save, person notes, manual line edits, and principles inputs — content still saves when storage allows (mirrors check-in intent).
- Playwright: journal crisis phrase, Your story blur, export button smoke tests in `e2e/safety.spec.ts`.
- Reflection note save also routes tier-3 to Help (save kept).
- Backend safety-gate `kms` keyword aligned with PWA kernel.
- Roman Urdu chrome for welcome/onboarding, check-in arrival, Calm context chips, Me card titles, toggle On/Off, FAB label, panic exit.
- `--crisis-ink` token; journal editor `:focus-visible` ring; calm copy when journal entry has many photos (>20).

### Changed
- `data.js` top-level packs use `var` (ES5); removed dead `setInference`, unused `region`/`inferences` from persisted state (migration read kept).
- Collapsed setting chip helpers; localized `toggleBtn` and `#fab`/`#panicExit` via `STRINGS`.
- Removed unused `.panic-call` / `.crisis-alt` CSS.
- SW `soulcap-v180`.

### Docs (2026-07-23)
- Synced HANDOVER, ARCHITECTURE, DATA_MODEL, ACCESSIBILITY, PRIVACY, EVALUATION, SAFETY, CLINICAL,
  FEATURES, ROADMAP, INVESTOR_DECK, USER_REVIEW, and PRESENTATION to **1.8.0** / schema **v10** /
  ~226 tests / Roman Urdu LTR / free-text tier-3 Help. Fixed stale RTL and “check-in only” claims.

## [1.7.0] — 2026-07-22

### Added
- **Premium motion tokens** (`--dur-instant` through `--dur-sheet`, `--ease-standard/out/soft`) wired through views, sheets, cards, and chips; reduced-motion uses opacity-only ≤90ms.
- **Roman Urdu chrome i18n**: expanded `STRINGS.rui` for tabs, FAB, Settings, theme/accent chips, empty states, reset/park, pattern short labels, map pace, common buttons; `t()` nested paths with en fallback; `tUi()` helper.
- Clinical English notice (once) when locale is Roman Urdu — dismissible via state + `localStorage`.
- Sheet open optional 8ms haptic (respects haptics + reduced-motion).

### Changed
- Softer cards (shadow-first, ~22px radius), lighter tab bar, spacing tokens (`--space-1`–`8`), deepened dark (`#0B0B0D` / `#141419`) and AMOLED surfaces.
- Sheet scrim/panel polish: 24px rise, 28px radius, 36×4 grabber, blur when motion allowed.
- SW `soulcap-v170`.

## [1.6.0] — 2026-07-22

### Added
- **Personal Manual** on You: sectioned lines (Rest, People, Work, Thinking, Recovery) grown from confirmed patterns, principles, and reset usage; edit, add, remove, refresh suggestions without overwriting user lines.
- **Library bookmarks**: save articles locally; Saved filter on the emotional library list.
- **Constellation depth**: private notes, life events, and closer/further ring history (cap 20) per person.
- **First-week empty states** on Now, Calm, Journal, Map, and You — calm copy, no guilt.
- Panic **Open my plan** one-tap link; manual refresh `aria-live` status.

### Changed
- Journal search matches mood, feeling tags, and parked thought titles; clear control with accessible label.
- State schema **v10** (`manual`, `libraryBookmarks`, person `notes`/`events`/`ringHistory`).
- SW `soulcap-v160`.

## [1.4.0] — 2026-07-22

### Added
- **Personal reset menu** on Calm: user-editable reset steps with local-day completion toggles (no streaks).
- **Thought parking** on Journal: park thoughts with Tomorrow / Weekend / One week reopen; due list only (no notifications).
- **Pattern confidence** labels (Low / Medium / High) on pattern rows and evidence sheet.
- **Emotional timeline** week view from check-ins and journal titles.
- **Gentle reflection cards** on Now after journal save, pattern confirm, or thought archive (skip / note / dismiss forever).
- **Emotion vocabulary** searchable chips in check-in detail and journal editor (~16 words + favorites).
- Optional **Principles** card on You for user-defined reminders.
- Constellation **map pace** (Still / Drift / Live) in Settings with drag inertia and focus glow on person sheet.

### Changed
- Greeting: late hours now `h < 6` (was `< 5`); morning 6–11, afternoon 12–17, evening 18+.
- **Roman Urdu (preview)** replaces Arabic-script Urdu — LTR layout (`lang=rui`), Latin tab/help strings; `ur` migrates to `rui`.
- You tab settings consolidated into a **Settings sheet** (Appearance, Language, Accessibility, Personalisation, Guided exercises, Constellation, Your data, About).
- PATTERN_UI summaries softened to may/might language.
- SW `soulcap-v140`. State schema **v9** (`mapPace`, `resetItems`, `resetDone`, `parkedThoughts`, `reflectionPrefs`, `pendingReflection`, `emotionFavorites`, `principles`).

## [1.2.1] — 2026-07-22

### Fixed
- Same-day check-in edits keep the original creation timestamp `t` and only bump `updatedAt`,
  so late-day pattern evidence stays honest.
- Migration ignores a corrupt non-array `inferences` value instead of wiping recoverable state.
- Library search exposes a polite live status with result count or no-match copy.
- Voice, haptics, pace, and Constellation preference toggles roll back when local save fails.

### Changed
- SW `soulcap-v121`. Architecture note clarified: accepted writes save-then-render with rollback.
  Playwright now at 186 mobile + desktop checks.
- Hub product page data bumped to **1.2.1** (library, drip, constellation polish). Local hub
  `SoulCap/` mirror synced to `docs/`. Marketing screenshots regenerated. In-repo screen gallery
  via `npm run gallery` → `screen-gallery.html`.

## [1.2.0] — 2026-07-22

### Added
- Constellation pinch: add or remove a ring (3–7). Outer people remapped when rings shrink.
- Long-press a ring label to rename that ring inline.
- Opt-in node sizing from logged “spoke today” frequency over the last 30 days. Copy states
  clearly this is frequency, never importance.
- Safety plan “People I can tell” can pull supportive names from the Constellation; free text
  still works.

### Changed
- SW `soulcap-v120`. Playwright covers ring remap, long-press rename, frequency sizing, and
  Constellation → safety-plan pull (182 mobile + desktop checks).

## [1.1.0] — 2026-07-22

### Added
- Adaptive drip questionnaire: up to four optional questions per local day, with branching from
  prior answers only. Builds gentle local estimates (stress, sleep, energy, resilience) with
  confidence labels. Estimates are viewable and correctable in “What SoulCap knows” and are never
  presented as diagnoses or clinical scores.
- Mood themes: Ocean, Forest, Rain, Space, Sunrise, Minimal, and AMOLED, alongside Auto / Light /
  Dark / Night. All use token blocks; contrast and reduced-motion stay intact.
- Language scaffold: English default plus Urdu layout preview (`dir=rtl`, tab/help aria strings).
  Clinical and safety copy remains English until a native clinical-copy review is complete.
- Accessibility gates for Help and Exercise dialogs (named modal semantics) and a 200% zoom smoke
  check on those surfaces.

### Changed
- Local state is now schema v8. Sequential migration adds `drip`, `userModel`, and `locale`
  defaults while preserving all v7 data.
- SW `soulcap-v110`. Playwright covers v7→v8 migration, drip day-cap, estimate correction, theme
  and locale persistence, and panic/runner a11y at enlarged text (174 mobile + desktop checks).

## [1.0.0] — 2026-07-22

### Added
- Searchable offline emotional library with six short articles covering anxiety and panic,
  overthinking, sleep, low mood, grief, and boundaries.
- Every article includes practical options, reflection questions, a when-to-seek-professional-
  support section, source notes, an explicit not-yet-clinician-reviewed notice, and links to
  stable exercise IDs.
- Optional daily supports for water, daylight, movement, journalling, connection, and quiet.
  Completion is per local day only, with no streaks, scores, badges, reminders, or missed-day
  pressure.

### Changed
- Local state is now schema v7. Sequential migration adds only daily-support choices and local-day
  completion records while preserving all v6 data.
- Daily-support choice and completion writes roll back visibly if browser storage is unavailable.
- SW `soulcap-v100`. Playwright now runs 164 mobile + desktop checks covering v6 migration,
  offline article search and focus, all article/skill-link contracts, daily-support persistence,
  and storage-failure rollback.

## [0.9.0] — 2026-07-22

### Added
- Optional detailed check-ins keep the existing one-tap arrival words, then offer five skippable
  dimensions, a direct need, and optional trigger tags. The same-day entry is edited in place.
- Deterministic local pattern cards appear only after repeated evidence across distinct days.
  Every card exposes its evidence, uses non-causal language, and can be confirmed, rejected, or
  hidden. Pattern observations can be switched off without deleting check-ins.
- The You tab now includes a factual seven-day summary with no score, streak, or diagnosis.
- Independent controls for four purple-family accents, standard/large text, compact/comfortable
  density, higher contrast, and reduced transparency.

### Changed
- Local state is now schema v6. Sequential migration enriches legacy check-ins with stable IDs,
  dimensions, triggers, direct need, and optional short feeling text while preserving old data.
- A direct need can influence the explainable recommendation, while the user’s arrival word
  remains stronger than ambient time context.
- Short free text entered specifically in check-in detail is assessed by the offline safety
  kernel. The full 160-character field is assessed, and explicit tier-3 wording opens the same
  hard-coded, number-free Help flow even when local storage is unavailable.
- New pattern and presentation controls roll back visibly when their local save fails.
- Removed the last stale crisis-number example from the safety-plan placeholder.
- SW `soulcap-v090`. Playwright now runs 152 checks across mobile + desktop, including migration
  rollback, check-in save rollback, pattern evidence/decisions, presentation persistence, and the
  check-in safety route.

## [0.8.2] — 2026-07-22

### Fixed
- Check-in intent now outranks time-of-day context. Steady, Wired, Flat, Heavy, and Not sure each
  produce a distinct recommendation instead of mostly collapsing to the late-night sleep card.
- “Not sure” now starts with gentle, low-demand grounding without pretending to know how the user
  feels. Recommendation reasons remain explicit.
- “Got anything to hand?” now accepts multiple resources. “Nothing” remains exclusive and clears
  the resource choices, so filtering stays understandable.

### Changed
- SW `soulcap-v082`. Playwright now runs 136 checks across mobile + desktop, including five-state
  recommendation differentiation and Calm multi-select filtering.

## [0.8.1] — 2026-07-22

### Fixed
- Restored the compact iPhone type hierarchy used before v0.8.0. Footer tabs, eyebrows,
  metadata, status badges, map labels, journal dates, and small guidance no longer compete with
  primary content.
- Kept interactive hit areas at 48px while reducing only their visual label scale. Body copy,
  headings, input text, and browser zoom remain unchanged.

### Changed
- SW `soulcap-v081`. Playwright now runs 132 checks across mobile + desktop, including a visual
  density regression check for footer labels and compact chrome.

## [0.8.0] — 2026-07-21

### Added
- **Journal templates.** New entries can begin blank or from seven gentle structures: three good
  things, morning pages, night reflection, worry dump, daily wins, a future-self letter, or a
  dream. Templates seed a draft only; nothing is required.
- **Private voice transcription.** The journal mic works only when the browser confirms an
  already-installed on-device language pack. SoulCap never installs a pack, calls a remote speech
  service, or falls back to `webkitSpeechRecognition`. Unsupported browsers keep the editor fully
  usable and explain that nothing was sent.
- **Photo book covers.** Local images are down-scaled on-device before becoming the journal cover.
  Cover edits are staged until Save and can be removed without affecting entries.
- **Real contents.** Journal entries are grouped by month, searchable by title or body, and
  reachable through month navigation.
- **Optional page decoration.** Entries can use a soft washi edge or folded-corner treatment,
  with plain pages remaining the default.
- **Synthetic user review.** Five isolated personas now exercise onboarding, Help, Calm, journal
  persistence, Constellation privacy, reduced motion, keyboard exit, and no-penalty stopping on
  both mobile and desktop. Findings and limits live in `USER_REVIEW.md`.

### Fixed
- Failed existing-entry and cover saves now restore the previous in-memory state and keep the
  editor open instead of appearing saved after localStorage quota errors.
- Installed-app shortcuts now route correctly: Help opens the hard-coded help screen immediately,
  and the retired Skills shortcut now opens Calm.
- Journal controls now use 48px touch targets, responsive horizontal tool scrolling, an accessible
  transcription live region, and theme tokens for photo-cover overlays.
- Skills marked for `any` capacity now remain eligible after Heavy or Wired check-ins. Previously,
  the rank comparison could leave low-energy Calm journeys with no matching cards.
- Sheet dialogs now trap focus, make background surfaces inert, and return focus to their opener.
- Delayed photo decoding is bound to the draft that requested it, so closing one entry and opening
  another cannot attach the earlier photo to the new page.
- Malformed query encoding no longer interrupts boot, and a second mic tap cancels pending local
  speech availability before recording can start.
- Spoken guidance now accepts only voices explicitly marked `localService`; no default or
  remote-capable voice is used.
- Service-worker navigation caching no longer lets a visit to `pitch.html` replace the offline app
  shell. The brand mark is now precached.
- All shipped text remains at least 15px, compact controls meet the 48px target, and the journal
  cover edit control keeps opaque contrast over arbitrary photos.

### Changed
- SW `soulcap-v080`. Playwright now runs 130 checks across mobile + desktop.
- Audio-blob fallback remains deliberately unshipped: blobs do not fit the JSON/localStorage
  contract, and base64 recordings would exhaust local quota. Voice text ships only where local
  transcription can be verified.
- The static pitch page now matches v0.8.0 product truth and no longer carries historical crisis
  numbers or v0.3 positioning.
- The publicly served v0.3 legacy page was removed; historical builds remain available in Git
  history without exposing stale crisis numbers or CDN requests.

## [0.7.1] — 2026-07-21

### Fixed
- **Exercises no longer race by.** Guided steps now show a **visible countdown** in the orb,
  stay on screen much longer (min ~9s, scaled by the pace setting), and swell gently across each
  step. Far kinder for anyone reading in a second language. New **Exercise pace** setting
  (Slow / Steady / Brisk) and a per-run "Pause the timer / I'll tap Next" control.
- **Voices no longer sound like a joke.** The picker now **filters out the novelty system voices**
  (Bubbles, Zarvox, Bad News…) that made it cartoonish, lists the enhanced/natural ones first,
  labels each by **accent** (American / British / Australian / Indian…) with an accent filter, and
  is honest that quality is best on a phone. Speed and pitch kept.

### Changed
- **Voice auto-quiets around people.** On the panic screen (and any exercise you launch after
  telling Calm you're "around people"), spoken guidance starts **silent** so it never blares in
  public. A one-tap speaker toggle turns it on if you're alone.
- **All crisis phone numbers and country selection removed** (owner decision — we can't promise any
  specific line is reachable). The help screen now gives gentle, number-free guidance: reach out to
  someone you trust, and contact local emergency services if in danger. Onboarding no longer asks
  your country.
- SW `soulcap-v071`. Tests now 88 across mobile + desktop.

## [0.7.0] — 2026-07-21

The journal becomes a book, the theme goes purple, and two annoyances are fixed.

### Added
- **Journal book cover.** A customisable cover sets the mood of the tab — editable title and
  subtitle, eight cover colours, and a sticker. Entries list under a "Contents" heading like a
  book's index.
- **Stickers in entries** — a sticker button in the editor drops an emoji into your writing.
- **Bigger "Your story" fields** — history text areas auto-grow as you write, with "add as many
  as you like, one per line" guidance. Easy to write a lot.

### Fixed
- **Journal lines now align with the text.** The ruled lines moved onto the writing surface and
  share its line-height, so words always sit on the rules no matter how tall the title is. It
  reads like a real notebook now.
- **No more auto-scroll to the top** when you change theme (or toggle any setting). The view
  re-renders in place and keeps your scroll position.

### Changed
- **Purple theme, matched to the logo.** The accent is now the logo's violet (`#6C5CE7` light,
  `#A78BFA` dark, dimmer in night mode) across buttons, the constellation centre, and highlights.
  Warm neutrals kept so it stays calm rather than neon.
- SW `soulcap-v070`. Tests now 84 across mobile + desktop.

## [0.6.1] — 2026-07-21

### Fixed
- **Constellation rewritten.** The old CSS group-spin flung the name labels off their
  transform origin — "names flying away, not rotating." It now rotates in JS (one slow
  revolution every 2.5 min, frozen under reduced-motion), repositioning each person per frame
  with labels kept upright. Premium finish: soft node shadows, readable label halos, a glowing
  centre. Drag-to-reposition works cleanly again.
- Close-ring nodes no longer graze the centre.

### Added
- **Rings up to 7**, and **you can name each ring** (default names kept if you don't).
- **History / "Your story"** — an optional section in You (never in onboarding): relationship
  status, who you live with, family, wider relatives, work/study, habits, hobbies, past
  relationships, and — clearly marked sensitive — hard things from your past. All local.
- **The engine adapts to what you share.** Single / a recent breakup / trauma gently reshape
  suggestions (more connection, more self-compassion, more grounding). Noting past trauma keeps
  potentially-activating exercises (e.g. body scan) out of auto-suggestions and shows a gentle
  caution — never a diagnosis.

### Changed
- **Crisis directory:** removed "Find a Helpline" (owner instruction). Added a **real Pakistan
  directory** — Umang (24/7), Taskeen, Rozan, Rescue 1122 — with hours shown. PK region now
  routes there instead of the international list. UK still routes to IASP + local emergency.
- SW `soulcap-v061`. Tests now 80 across mobile + desktop.

## [0.6.0] — 2026-07-21

Personalisation, a real journal, guided breathing, and a proper tab structure.

### Added
- **Five clean tabs: Now · Calm · Journal · People · You.** Short labels fix the footer
  alignment. The old Techniques tab is gone — the full library now lives *inside* Calm, which
  became a guided front door.
- **Calm is now a guided flow.** "What do you need right now?" (settle / lift / sleep / get out
  of my head / be kinder / feel less alone) → then where you are and what's to hand → a shortlist
  of techniques that actually fit. "Browse all" opens the whole library. No longer a near-copy of
  the Techniques list.
- **Profile.** Name, age and pronouns (all optional, local). The home greeting uses your name,
  and there's a dedicated onboarding step for it. First real personalisation.
- **Journal.** A private, paper-feeling diary — serif throughout, ruled lines, warm stock.
  Title, free writing, mood, and **photos** (down-scaled on device so local storage survives).
  Optional writing prompts. Entries are yours, local, deletable.
- **Apple-Watch-style breathing.** Paced techniques (box, 4-7-8, physiological sigh) open a setup
  screen: pick your **breaths** and **pace**, see the **estimated time**, then a synced orb + voice
  + haptics runs the *whole* cycle with detailed "in through the nose / out through the mouth" cues,
  breath count and time remaining.
- **Guided step walk-through, on by default** — every non-breathing technique now moves through
  *all* its steps, spoken and paced, not just the first. Manual Next still there.
- **Night theme** joins light and dark in the appearance picker.
- Settings reorganised into clear groups (Appearance · Guided exercises · Constellation extras ·
  Your data), with the profile and safety plan surfaced as cards in You.

### Fixed
- **Check-ins no longer stack.** Tapping a mood several times in one day updates that day's entry
  instead of piling up new ones; a new calendar day starts a fresh entry. It now tracks by date.
- Footer tab alignment — even widths, consistent icon sizing, labels never wrap.
- Runner scrolls on short screens so the breathing setup's controls are always reachable.

### Changed
- SW `soulcap-v060`. Onboarding is five steps (adds the name step). Tests now 70 across mobile +
  desktop, covering breathing setup, journal save, the paper editor's serif face, and check-in dedup.

## [0.5.1] — 2026-07-21

### Added
- **Guided runner — the app exercises *with* you.** Every technique now runs with a breathing
  orb, spoken steps, and a **"Guide me"** mode that paces you step-by-step on a calm timer, like
  a therapist walking you through it. Manual Next stays available for anyone who wants to move
  faster. Breathing haptics on the pacer.
- **Persistent floating Help button** on every tab, so crisis routing is always one tap away
  without scrolling.
- **Drag people in and out on the Constellation** to change how close they feel — the map freezes
  while you drag, snaps to the nearest ring, and resumes its slow orbit on release.
- Constellation polish — centre glow, a gently pulsing "you", a soft radial field behind the map.

### Changed
- **Removed the UK crisis lines** (Samaritans, Shout, 999) at the owner's instruction. UK now
  routes to the international directory (findahelpline, which resolves to the user's real country)
  rather than an empty help screen. US 988 unchanged.
- Demo (`?demo=1`) now seeds the Pakistan region, so it shows what target users actually see.
- SW `soulcap-v051`. Tests now 62 across mobile + desktop, incl. guided mode, persistent help,
  and a guard that the removed UK lines appear for no one.

## [0.5.0] — 2026-07-21

Design System v2 and a much larger technique library.

### Added
- **Design System v2 — "deep plum & warm sand."** Palette anchored to the brand mark
  (`BRAND-LOCK.json`), which is violet. Chroma held low throughout so it reads calm rather than
  as the usual purple-gradient wellness look. Three themes: light, dark, and **night** — dimmer
  than dark, deliberately below AA contrast, for waking at 3am when a normal screen is too
  alerting. Opt-in only, never the default.
- **Splash and welcome screens**, with the real mark.
- **Calm tab** (fifth tab) — a dedicated grounding hub with **context filtering**: "where are
  you" and "what have you got to hand" narrow the list to techniques you can actually perform.
  Cold water needs a sink; humming needs privacy. Most apps hand you something you can't do.
- **37 techniques**, up from 17, organised by mechanism: nervous system, senses, orienting,
  crowding out, self-soothing, imagery, sleep, thinking, doing, people. Each documents *why it
  works*, its contraindications, what it needs to hand, and whether it's discreet enough for public.
- **Safety plan** — Stanley-Brown safety planning. Warning signs, what helps alone, places and
  people, professionals, making your space safer. Written when steady, surfaced when not.
- **Voice guidance** using device speech synthesis, with voice, speed and pitch pickers. Local
  only — no audio files, no network.
- **Breathing haptics** synced to the pacer, so exercises work with eyes closed.
- **Post-episode capture** — one tap after a hard moment, feeding the suggestion engine.
- **Journey** view inside You — what's happened, no score and no rating.
- Constellation: **slow orbital rotation** (one turn per 2.5 min, frozen under reduced-motion),
  **3–5 user-selectable rings**, optional links between people, optional contact history.
  Both extras are off by default and contact history never nags.
- Technique detail sheets — every card is tappable and explains its own mechanism.
- Shortlist: save techniques, and they surface first in Calm.

### Fixed
- Constellation outer ring radius overflowed the viewBox (204 in a 400 box) at 3 rings.
- Node labels rotated with the orbiting group and read upside down half a revolution in.
  They now counter-rotate about their own centres.

### Changed
- SW `soulcap-v050`. Tests now 56 across mobile and desktop.

## [0.4.0] — 2026-07-21

Full PWA rebuild on Design System v1. Offline-first, local-only, no LLM.

### Fixed — safety
- **Inflected crisis phrasings escaped the safety gate.** `end my life` is not a substring of
  `ending my life`, so "I have been thinking about ending my life" scored tier 0. Crisis
  keyword lists now carry inflected forms in both `docs/app.js` and the Nest
  `SafetyGateService`. Found by the new e2e suite.

### Added
- Design System v1 — deep evergreen UI accent, warm green-cast neutrals, serif/sans two-register
  typography, both themes designed separately. Brand mark stays purple per `BRAND-LOCK.json`.
- **Constellation** — relationship map. You at centre, people placed by closeness across three
  rings. `hard right now` permanently suppresses suggestions for that person, with no
  reconciliation nudges. The app never contacts anyone.
- Offline skills engine — 17 cards across breath / rest / clarity / move / warmth / connect /
  reflect, with a step-by-step runner and helpfulness feedback.
- Suggestion engine with a stated reason on every suggestion, capacity filtering, and time-of-day
  weighting (sleep skills win late at night).
- Onboarding: 18+ age gate, region selection, plain-language consent, optional concerns.
- "What SoulCap thinks it knows" — trust tiers (you said / observed / a guess), guesses shown as
  questions the user answers rather than conclusions.
- Export and permanent delete on the main surface, not buried in settings.
- 54 Playwright e2e tests (mobile + desktop) covering risk tiers, false-positive guard, help
  reachability, age gate, Constellation suppression, a11y and offline.
- CI workflow — safety tests gate the Pages deploy.

### Changed
- Service worker rewritten: relative paths, cache-first for assets, network-first for navigation.
  Previous SW was network-first for everything, which broke offline on flaky connections.
- Crisis directory is region-aware. **No Pakistan-specific numbers ship** — none verified as
  live and staffed, so PK routes to the international directory. Absent beats wrong.
- SW `soulcap-v040`.

### Preserved
- `docs/legacy-v032.html` — previous release, still reachable.

## [0.3.2] — 2026-07-20

### Home deep — quiet room MOBILE≠DESKTOP
- Mobile: linen texture + room strip (half-open door, empty chair, light ray)
- Desktop ≥900px: 3-pane layout — room visual + check-in center + care rail (stats, habits, companion note, grounding)
- Sage orb glow (no purple takeover); clinical banner sage tokens
- SW `soulcap-v032`

## [0.3.0] — 2026-07-20

### Beauty — quiet journal / safety gate
- Splash journal cover; soft sage orb (no purple glow)
- Light+dark tokens + Appearance settings; theme-color aligned
- SW `soulcap-v030`

## 0.2.3
- Museum honesty: live check-ins/journals; demo seeds; SW soulcap-v023.
- Soften INVESTOR_DECK / PRESENTATION / HANDOVER: Smart Companion shipped; Nest = lab only.
- `?demo=1` always skips onboarding UI (half localStorage state); Skip on step 1 for non-demo.

## 0.2.2 — 2026-07-19

- Check-ins persist to `sc_checkins`
- Thin `docs/pitch.html` + Capricorn QR
- SW `soulcap-v022`

## 0.2.1 — 2026-07-19 — PWA truth + no dead ends

- README: live product = Pages PWA; Nest/Expo labeled source lab (not AI marketing).
- Profile: real journal/audit counts; privacy sheet; reminder preference; delete clears `sc_*`.
- `?demo=1` walkthrough; Capricorn QR in profile; SW `soulcap-v021`.
- Removed “coming soon” settings toasts.

# Changelog

## 0.2.0 — 2026-07-19 — Clinical path

- **CLINICAL.md** — SaMD gap checklist + clinician MVP + safety production rules.
- PWA: informed consent gate · keyword Tier-3 crisis rail (pause companion + Panic/988) · clinician panel (notes + audit) · escaped chat HTML.
- Backend: `ClinicalModule` `/api/v1/clinical/*` demo stubs · Prisma migrate baseline placeholder · `bcrypt` + `@nestjs/jwt` declared · safety-gate Jest unit tests.
- Version `0.2.0` · SW `soulcap-v020`.
- Honesty: **clinician-supported wellness companion / clinical path** — **not** a cleared medical device, not therapy, not diagnosis.

## 0.1.0 — 2026-07-19 — Cap Family Mega-Wave (safety-first)

- Added `VERSION.json` (0.1.0) and `SAFETY.md` (not clinical care; wired vs claimed; blockers).
- Honest README / FEATURES.md — no “production therapy” / clinical-grade marketing.
- Wired Cap Family brand icons into Expo `mobile/assets` + `docs/icons`; Expo `app.json` → SoulCap 0.1.0.
- Fixed mobile entry (`expo/AppEntry.js` + classic `App.tsx`); removed unused expo-router plugin.
- Bumped PWA SW cache to `soulcap-v010`.
- **Skipped:** clinical launch, store builds, full FE↔BE PWA wire.

## 2026-06-16 — Apple-quality visual redesign
- True black theme, specular orb, spring-physics overlays (PWA shell).

## 2026-06-15 — Complete PWA redesign
- Premium iOS-quality product polish across the PWA surface.

## 2026-06-14 — PWA added
- SoulCap PWA demo shell installable from browser alongside backend + mobile client source.

## 2026-06-13 — Initial release
- SoulCap AI emotional wellness platform: backend (Living Mind Model) + mobile client MVP source.
- Status: built source, not deployed. See HANDOVER.md / SAFETY.md.
