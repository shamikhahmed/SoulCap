# SPEC v2.0 — Premium polish pass (build guide for Cursor)

> **The assignment: make SoulCap feel like a flagship product from a top studio.** Not more
> features — *craft*. The difference between "a good indie app" and "shipped by Apple / Calm /
> Headspace / Linear." Work at highest effort. Every change stays inside `AGENTS.md` rules
> (offline, no network, ES5, tokens, `el()`, tests, cache bump, CI-green).

The app is feature-complete and healthy at **v1.9.3** (5 tabs, 37 techniques, 24-experience
clinical library, PHQ-9/GAD-7 reflection screeners, journal, Constellation, You). It now needs a
**consolidation + polish pass**, because features piled up faster than the information architecture
and craft were tightened. This spec is that pass.

---

## 0. The quality bar (what "big company" means, concretely)

Judge every screen against this rubric. If any answer is "no", it isn't done:

1. **Calm at a glance.** One clear primary action per screen; nothing competes for attention.
2. **Nothing arbitrary.** Every margin, size, weight, radius, and duration comes from the token
   scale — no one-off values. Optical alignment, not just mathematical.
3. **One voice.** Copy is warm, brief, consistent (same words for the same things everywhere).
4. **One icon family, one motion language.** No mixed stroke widths, no scattered easings.
5. **Every state is designed.** Empty, loading, error, first-run, success — none are afterthoughts.
6. **It feels instant.** No jank, transitions ≤ tokens, 60fps, no layout shift.
7. **Accessible = premium.** Full VoiceOver, Dynamic Type, focus order, reduced-motion parity.
8. **You'd screenshot it.** Each screen could sit in an App Store gallery unedited.

Reference feel: **Apple Health** (information design), **Calm/Headspace** (serenity + motion),
**Linear/Things** (precision, microcopy, empty states). SoulCap's own identity — plum/violet,
serif-voice, low chroma — stays; this pass makes it *consistent and exact*, not different.

---

## 1. Information architecture review (do this FIRST — it shapes everything)

The **You** tab has grown to ~11 stacked cards (Profile, Your story, My plan, Your journey, Recent
seven days, What SoulCap knows, Settings, Your week, Principles, My manual, …). That's a wall.
A flagship app groups. Restructure You into **3–4 labelled sections with clear hierarchy**:

- **About you** — profile · your story · what SoulCap knows.
- **Your insights** — journey · seven-day summary · patterns · emotional timeline.
- **Your tools** — safety plan · personal manual · principles.
- **Settings** (sheet, already exists) + About/version at the foot.

Use section headers + generous spacing so it scans in one flick. Do the same audit for **Now**
(prioritise: greeting → check-in → the one suggestion → everything else quieter) and **Calm**
(guided path first; browse/library one level down).

**Deliverable:** a short IA map in the PR description showing what moved where and why. Nothing
should be more than 2 taps from where a user would look for it.

---

## 2. First-run experience (the first 60 seconds define "premium")

- **Splash:** logo lockup, a single calm breath of motion, then hand off — no jank, no flash of
  unstyled content, correct theme from the pre-paint script.
- **Welcome + onboarding:** unhurried, one idea per screen, progress dots, every step skippable,
  Help reachable throughout. Review copy line-by-line for warmth and brevity.
- **Empty first-run states everywhere:** Journal, Constellation, Journey, Library, Patterns — each
  needs a designed, inviting empty state (one warm line + one clear action), never a blank card.
- Add a subtle **"what's new" note** surfaced once after an update (dismissible, no nag).

---

## 3. Microcopy pass (big companies obsess over this)

Read **every** user-visible string. Rules:
- Same concept = same word everywhere (audit "technique" vs "exercise" vs "skill"; pick one).
- Buttons say exactly what happens ("Save", then a "Saved" confirmation).
- Tentative, never clinical-cold — even the new clinical content should sound like a kind, informed
  friend, not a textbook. (Check the 24 experiences + 2 articles read warmly, not like WebMD.)
- Errors: calm, blameless, with the fix. No apologies, no jargon.
- Trim every sentence. If a word can go, it goes.
- Consolidate copy into `STRINGS`/`*_UI` in `data.js` so it's reviewable in one place.

---

## 4. Motion & haptics choreography

- **One easing language** from tokens (ease-out, no overshoot). Audit for stray `linear`/`spring`.
- Choreograph, don't scatter: view transitions, sheet in/out, card press, tab change should feel
  like one system. Durations from tokens (`--dur-*`).
- **Haptics** are intentional and consistent: a light tick on selection, a softer cue on completion,
  the breathing pulse on the pacer. Never buzzy. Off under reduced-motion.
- Everything degrades cleanly under `prefers-reduced-motion` (opacity-only, ≤ ~90ms) — verify parity
  on every animated surface.

---

## 5. Visual consistency audit

- **Spacing:** one scale (4/8/12/16/24/32/48…). Grep for off-scale px; replace with tokens.
- **Type:** one scale, serif=voice / sans=chrome discipline held everywhere; nothing < 15px body
  (compact metadata labels only per `.cursorrules`). Balance headings (`text-wrap: balance`).
- **Icons:** one family, one stroke width, one size grid. Replace any mismatched glyphs.
- **Cards / sheets / chips / inputs:** identical radius, padding, border, shadow across the app.
  Standardise on the token'd component look; kill visual drift between older and newer screens.
- **Elevation:** consistent shadow/lightening story per theme (dark elevates with lighter surfaces,
  not reused light-mode shadows).
- **Color:** accent used sparingly (one filled action/screen); category hues consistent; the
  reserved emergency treatment used only for red-flags/Help.

---

## 6. Component states

Every interactive element needs designed hover / press / focus-visible / disabled states, consistent
app-wide. Focus rings visible and on-token. Selected states (chips, theme swatches, tabs) unmistakable.
Touch targets ≥48px (already enforced — keep it).

---

## 7. Accessibility as a premium feature

- Full **VoiceOver / screen-reader** pass on panic, runner, screeners, journal editor, sheets:
  meaningful labels, correct roles, sensible focus order, dialog semantics.
- **Dynamic Type**: layout holds to 200% with no clipping or overlap.
- Reduced-motion + high-contrast honored everywhere.
- The clinical content and screeners must be fully narratable (they carry the most important words).
- Add tests where assertable (roles, labels, target size, contrast) — extend the existing a11y specs.

---

## 8. Details that signal craft

- App **About** screen: name lockup, one-line purpose, version, "not therapy / not reviewed" honesty,
  a quiet credits/acknowledgements line.
- Consistent **loading/settle** behavior (no flashes; skeletons only if something is genuinely async
  — here it's local, so prefer instant).
- **Install polish**: manifest name/short_name/description/categories, maskable icons, shortcuts to
  Panic and New journal entry, themed splash.
- Regenerate the **screen gallery** (`npm run gallery`) and review every shot against §0. Fix the
  worst offenders first.

---

## 9. The new clinical content — hold it to the same bar

- Experience detail sheets: same card/sheet system, same spacing, same warm voice as the rest.
  What it is → why → what helps (tappable skill cards) → self-care → reflection → red-flag → source.
- Red-flag panels: unmistakable but calm; consistent treatment for `emergency` vs `seeDoctor`.
- Screeners: feel like a gentle reflection, not a medical form — one question at a time, generous
  spacing, the "not a diagnosis" line always present, results shown kindly with a clear next step.
- Verify none of it reads cold or clinical; it should feel *made for a scared person at 2am.*

---

## 10. Sequencing (each PR shippable, green, cache bumped)

1. **PR-1 IA restructure** (§1) — You/Now/Calm grouping + hierarchy. Highest leverage; do first.
2. **PR-2 component + token consistency** (§5, §6) — unify cards/sheets/chips/inputs/spacing/icons.
3. **PR-3 microcopy pass** (§3) — consolidate + rewrite strings.
4. **PR-4 motion & haptics choreography** (§4) + empty/first-run states (§2).
5. **PR-5 accessibility pass** (§7) + About screen + install polish (§8).
6. **PR-6 clinical-content polish** (§9) + regenerate & review gallery (§8).

After each: CHANGELOG; bump `sw.js` CACHE + `VERSION.json` + `APP_VERSION`; bump SAFETY/HANDOVER;
`npm run verify` reliably green; push; confirm live cache.

## 11. Guardrails (unchanged, every PR)
- No network, no deps, ES5, tokens, `el()`. No "you have X" language; screeners say "not a
  diagnosis"; red-flags present & country-agnostic; tier-3 Help intact; not-reviewed banner stays.
- Polish must not regress safety copy, offline behavior, or contrast. Add/keep tests green.
- **Do not add features in this pass.** If you spot a genuine gap, note it in the PR for the roadmap
  — don't scope-creep the polish.

---

## Definition of done for v2.0
A first-time user opens the app and, within a minute, believes a serious company built this: it's
calm, coherent, fast, kind, and every screen looks intentional. Nothing feels bolted on. It reads
like one product with one voice — and it's honest about being a self-help tool, not a doctor.
