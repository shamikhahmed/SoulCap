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
