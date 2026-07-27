# SPEC v6.0 — Production-grade pass + new depth (master build guide for Cursor)

> **Goal: get SoulCap to the bar where a clinician or an App Store reviewer would be impressed,
> not just tolerant.** This is the definitive production + polish + new-features assignment. Run it
> as a **continuous loop** (see §12) — implement a phase fully, verify, bump, doc, gallery, commit,
> push, then move to the next phase without stopping until all phases are done.

**Owner-confirmed 2026-07-24:** (1) **Delete** the weakest themes (do not just hide them) — keep
**Auto · Light · Dark · Night · AMOLED · Ocean · Forest**; **remove Rain, Space, Sunrise, Minimal**.
Accents → **3**. (2) Build **worth-returning-to, NOT addictive** — the anti-addiction guardrail in
§9/§13 is final and non-negotiable. (3) Build **all** the new depth: self-concept (H1), pattern
engine (H2), habits (H3). Run every phase to completion in one loop; **stop only when J is done.**

Current: **v5.1.9** (schema v12). Vanilla offline PWA in `docs/` (`index.html`, `app.css`,
`data.js`, `app.js`, `vendor/`, `sw.js`). All `AGENTS.md` rules hold. This spec supersedes the
open items in v2.3/v3.x specs where they conflict.

**Adaptation of the "principal architect" brief:** this app has **no DB, no API, no server, no
auth, no framework** — it is local-only ES5 + tokens. So skip every DB/GraphQL/REST/auth/bundler
phase from that generic prompt. The real production surface here is: **code health, layout/density,
design-system consistency, keyboard/scroll/safe-area behaviour, accessibility, offline integrity,
and the new depth features.** Do those to a world-class standard.

---

## 0. Confirmed defects to fix (measured on v5.1.9)

1. **Journal blank page is broken.** New entry → Blank page: the body textarea has `flex-grow:0`
   + fixed `min-height`, so it collapses to ~2 lines, the toolbar floats mid-screen, and there's a
   huge dead void below (placeholder even clips: "Nobody else will ever…"). **Fix:** the editor is
   a flex column — header (fixed) · **body `flex:1` filling all space** · toolbar pinned to the
   bottom (keyboard-safe, `env(safe-area-inset-bottom)`). Body scrolls internally; ruled lines fill
   the whole writing area. No void, ever, at any entry length.
2. **Cards / tiles are too big.** The Now hero is 255px = **31% of a phone screen** for one
   suggestion, with more padding than content needs. **Fix:** define a tighter density — hero ≤
   ~200px, standard tiles ~2 lines + action, list rows ~56px. Reduce card padding from 16→ a
   tokened `--pad-card` and use tighter values. The screen should show **3–4 things above the fold**,
   not 1½.
3. **Too many themes/accents — overwhelming.** 11 themes × 4 accents + text/density/contrast/
   transparency/motion is a lot for someone in distress. **Fix:** collapse to a curated set:
   **Auto · Light · Dark · Night** as the primary choice; KEEP Auto/Light/Dark/Night/AMOLED + Ocean + Forest; **DELETE Rain, Space, Sunrise, Minimal** and their
   tokens/gallery variants. Accents → 3.
   Everything else (density, contrast, transparency, motion) grouped under "Accessibility" so the
   main Appearance screen is calm and short.

---

## 1. Phase A — Repository audit (report first, no code)

Produce `AUDIT-v6.md`: a map of `app.js` (it's ~5,300 lines in one IIFE — list every render/sheet
function and its ~size), dead/duplicate code, unused CSS tokens, unused `data.js` exports, any
console.logs, any inconsistent naming, and the top 10 risks. **No code changes in this phase.**

## 2. Phase B — Code health (no behaviour change)

- Split `app.js` conceptually into clearly-commented sections (state · safety · router · runner ·
  journal · constellation · settings · motion). It can stay one file (no build step) but must be
  navigable — banner comments + a function index at the top.
- Remove dead code, unused tokens/exports, stray console.logs, commented-out legacy.
- One name per concept (audit "technique/exercise/skill" → **technique** everywhere, incl. copy).
- No duplicate helpers. `el()`/`$()`/`clear()` are the only DOM primitives.
- Verify offline integrity: `sw.js` ASSETS list matches what `index.html` loads; nothing fetched.

## 3. Phase C — Layout, density & the card system (§0.1, §0.2)

- Fix the journal editor flex layout (§0.1).
- Introduce density tokens (`--pad-card`, `--gap-section`, `--tile-min`) and apply app-wide so cards
  are compact and consistent. Kill the "everything is huge" feel. 3–4 items above the fold.
- Audit **every** screen for: alignment to the 4/8/12/16 grid, consistent radius/elevation, no
  overflow, safe-area (notch/Dynamic Island/home indicator) respected on header, footer/tab bar,
  FAB, sheets, and full-screen flows.
- **Header/footer:** the tab bar and any header must be pinned, safe-area-padded, and never overlap
  content or the keyboard. FAB never covers a tile (regression test already exists — keep it green).

## 4. Phase D — Keyboard, scroll & focus behaviour (native feel)

Define and implement, per surface, **when the keyboard appears**:
- **Autofocus (keyboard opens on open):** journal editor body, "add a thought" park, any single-
  purpose text entry the user came specifically to type in.
- **No autofocus (keyboard stays down):** onboarding steps, Settings, browsing/reading, Now,
  Calm, screener chip questions, the Guided Path chip steps — anything chip/tap-first.
- When the keyboard is up: the active field stays visible (scroll into view), the toolbar sits above
  the keyboard, nothing important is covered. On blur, layout restores with no jump.
- Momentum scroll, no rubber-band trapping, `-webkit-overflow-scrolling` where relevant.

## 5. Phase E — Design system consistency

One token set for colour, spacing, radius, border, elevation, type, motion. Grep for any hardcoded
px/hex in components and replace with tokens. Every component (button/chip/input/toggle/segmented/
card/tile/sheet/list-row/empty/notice/red-flag) has one look and all states (rest/press/focus-
visible/selected/disabled) in every theme. Typography: one scale, serif=voice / sans=chrome,
balanced headings, ≥15px body, consistent letter-spacing on labels.

## 6. Phase F — Dark / Light / Night parity + contrast

Every screen in every mode: nothing blends into the background, all text ≥ AA (≥7:1 for the
breathing countdown and safety copy), icons/dividers/toggles visible, gradients don't wash out
text. Fix any regressions the theme cull might introduce.

## 7. Phase G — Accessibility (clinician/reviewer grade)

Full VoiceOver labels/roles/focus order on Panic, Runner, Screener, Journal editor, sheets;
Dynamic Type to 200% with no clipping; reduced-motion parity; ≥48px targets; visible focus rings;
semantic roles (`switch`, `radiogroup`, `dialog`). Add tests where assertable.

## 8. Phase H — New depth: the psychology the owner described

### H1 — Self-concept & self-presentation (the "how I see myself vs how I show the world")
The real terms: **self-concept**, **impression management / self-presentation**, and the gap
between the **authentic self** and the **presented (social) self** — plus the *effort* of
maintaining a mask (linked to burnout and anxiety). Build a reflective module (NOT a test, NOT a
score):
- A gentle exercise: *"Two versions of you"* — the user notes, in their own words, how they feel
  inside vs how they think they come across, in a few life areas (work, family, friends, online).
- Surface, softly: where the two overlap and where they diverge, and *"how much energy does keeping
  that up take?"* — a self-rated effort slider per area (their rating, never the app's judgement).
- Frame it as insight, never diagnosis: *"Many people carry a gap between the two. Noticing it is
  the point — not closing it."* Link to self-compassion + ACT (values/authenticity) techniques.
- Feeds the pattern engine as a **declared** signal (highest trust tier), user-visible and editable.

### H2 — A smarter, safe "pattern" engine (the "app should know what he feels")
The owner wants the app to *recognise the user*. Do it **safely** = estimates with confidence, never
diagnosis. Extend the existing pattern engine + user model:
- Combine signals: check-in dims, triggers, screener bands, technique feedback, experiences viewed,
  Guided Path families, journal moods, self-concept effort, sleep/wind-down, habits (H3).
- Surface **tendencies**, not labels: *"Lately, evenings and social days seem to weigh more on you,"*
  *"When you move, the next check-in tends to be calmer."* Always tentative, always inspectable
  ("here's what this is based on"), always correctable, with a global off switch.
- **Hard guardrail:** never output a condition name, never "you have X," never a severity verdict.
  It reflects patterns back; the user and a professional interpret them. Keep the "not a diagnosis"
  line on every surface. PHQ item-9 / tier-3 keywords still route to Help.

### H3 — Bad-habits / behaviour support (evidence-informed, no shame)
Optional habit-change support drawing on habit-loop (cue → routine → reward) and urge-surfing:
- The user names a habit they want less of (doom-scrolling, late nights, a substance, etc.),
  identifies its cue and the need it meets, picks a replacement, and can log urges/slips **without
  judgement** — no streaks, no red counts, no "you failed." A slip is data, not a verdict.
- Link to urge-surfing, opposite-action, wind-down. Frame progress as *understanding*, not a score.

## 9. Phase I — Visual engagement (the therapist's note) — done the honest way

> **Important reframe, and an owner decision needed.** The therapist suggested "visual things so the
> user stays interested." Good — a beautiful, alive, rewarding-to-open app is right. But you also
> said *"gets addicted."* **Do not build for addiction.** It directly violates this product's core
> ("success = the user needs the app less") and the no-dark-patterns rule, and a clinician reviewing
> an *addictive* mental-health app would reject it. Build **worth-returning-to**, not **hard-to-put-
> down**: calm ambient motion, a living breathing orb, gentle "what's shifted" reflections, seasonal
> warmth — never streaks, guilt pings, variable-reward loops, or engagement-timed notifications.
> This is a guardrail, not a preference.

Within that: add tasteful ambient depth (the orb, drifting gradients, a calm "your week" bloom),
satisfying micro-interactions, and a gentle end-of-session moment — all Still-preset-safe.

## 10. Phase J — QA & final validation

Break it on purpose: rapid tab-switching, mid-animation navigation, keyboard open during a sheet,
storage-full mid-save, offline reload, 200% type, reduced-motion, small screen (320px) and large,
landscape. Fix every issue. Re-run the full suite; add tests for the journal-layout fix, density,
keyboard-focus rules, and the new modules' safety routing.

---

## 11. Settings, finalised (the concrete "how many themes/colours" answer)

- **Appearance (primary):** Auto · Light · Dark · Night. Accent: 3 curated. Ambient set is just **Ocean · Forest** (a small "Ambient" row). Rain/Space/Sunrise/Minimal are deleted.
  Nothing else on the top level.
- **Accessibility (own group):** text size · higher contrast · reduce transparency · reduce motion.
- **Guided exercises:** spoken guidance · voice & accent · pace · vibration.
- **Constellation · Personalisation · Your data · About.** Each row explained in one line.

---

## 12. EXECUTION PROTOCOL — run as a loop, do not stop

Phases in order: **A (audit) → B (code health) → C (layout/density + journal fix) → D (keyboard) →
E (design system) → F (theme parity) → G (a11y) → H (new depth: H1, H2, H3) → I (visual, honest) →
J (QA).** For each phase (break big phases into shippable PRs):
1. Implement fully — real code, no stubs/TODOs.
2. `npm run verify` — green (mobile + desktop). Fix until green.
3. Bump `CACHE` (`sw.js`) + `VERSION.json` (version+swCache) + `APP_VERSION` (`app.js`) +
   `package.json` — all matching.
4. Update every affected doc: `CHANGELOG.md`, `SAFETY.md`, `HANDOVER.md`, `ROADMAP.md`,
   `ARCHITECTURE.md`/`DATA_MODEL.md`/`ACCESSIBILITY.md` as touched; `AGENTS.md`/`.cursorrules` only
   if a rule changes.
5. `npm run gallery` → commit updated `docs/screenshots/gallery/*`, manifest, `screen-gallery.html`.
6. Commit + push `main`. Confirm CI green and live `sw.js` on the new cache.
7. Next phase. **Do not stop until J is done**, then post a summary: what shipped per phase, what
   changed structurally, any risks, and anything deliberately left out.

## 13. Guardrails (unbreakable, every PR)
Offline/vendored only, no network, ES5, tokens, `el()`. **Never diagnose**; new pattern/self-concept
modules output tendencies + "not a diagnosis," user-correctable, global off. Tier-3 Help + PHQ
item-9 routing intact; red-flag panels stay. **Per-sheet "not yet reviewed" banners are REMOVED**
and consolidated into one honest not-medical line in **About / Legal** (owner decision 2026-07-27,
see `ROADMAP-v6-flagship.md` §0/P3) — the line always stays; nothing may imply clinical review or
diagnosis. **No addiction mechanics** — no streaks, variable rewards, guilt, or engagement-timed
pings. Panic stays the plainest, gesture-free surface. Nothing marked clinically reviewed.

## 14. Definition of done
A therapist opens it and sees something considered, safe, and genuinely useful — not a toy, not a
clinic knockoff. Every screen is compact, aligned, readable in all modes, and calm. The journal
never shows a void. The app reflects the user back to themselves — self-concept, patterns, habits —
without ever pretending to diagnose. It's beautiful enough to want to return to, and honest enough
to help you need it less.
