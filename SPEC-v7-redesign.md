# SPEC v7 — "Quiet Depth" full visual-identity redesign

> **This is NOT a polish pass. This is a new visual identity.** v6.0.10 kept the exact same
> composition (serif greeting + chip row + one boxed hero card + two tiles + 5-tab bar) on every
> screen — only density/tokens changed, so the app *looks the same*. v7 tears down and rebuilds the
> look of every screen. If a screen still matches its v6.0.10 screenshot, the phase is NOT done.
>
> Read `AGENTS.md`, `SPEC-v6.0-production.md`, `ROADMAP-v6-flagship.md`, `SAFETY.md` first. All hard
> rules and guardrails still hold (offline, ES5, `el()`, no network, safety kernel, no crisis numbers,
> worth-returning-to-not-addictive). Run as a loop; each phase: build fully → verify → bump all 4
> version fields → doc → gallery → commit → push → next. STOP only when V1–V9 all done.

---

## The identity: "Quiet Depth"

**One sentence:** a still, dark room with one source of soft light that breathes — editorial calm on
the surface, one living ambient layer underneath.

- **Editorial surface.** Serif = the app's voice (large, confident, few words). Sans = chrome only.
  Generous vertical space. Content organised by **hairline rules and sections**, NOT by boxing every
  thought inside a floating rounded rectangle. Think a well-set page, not a dashboard of cards.
- **One living layer.** A single, slow, GPU-cheap ambient gradient/field behind content (the same
  family as the breath orb) that drifts and responds subtly to context (time of day, current mood,
  breathing). It is the ONLY "animated" identity element. Everything else is still. Respects
  reduced-motion + the Still/Balanced/Vivid preset (Still = frozen gradient, no drift).
- **Depth via light, not borders.** Elevation ramp = layered translucency + soft shadow tokens, not
  a 1px border around everything. Retire border-boxed cards as the default container.
- **Motion = physics, once.** One easing curve. View Transitions between tabs and into flows. Press =
  scale 0.98 + light settle. No bounce, no confetti, no gimmicks.

**Palette:** keep Amethyst as base but add a real elevation ramp (`--layer-0..3`) and one `--living`
gradient token per theme. All 7 themes get the new ramp; contrast stays AA / ≥7:1 on safety + breath.

---

## Phase map (each must produce a VISIBLE, screenshot-different result)

### V1 — Splash (new first frame)
Replace the current splash. New: dark ground, a single soft radial light that performs **one breath**
(gentle inhale→exhale, ~2.5s) while assets precache; wordmark fades in low-contrast, then **dissolves
via View Transition** into Welcome. No spinner, no logo pop, no progress bar. On reduced-motion: static
light + wordmark, then cut. Must not resemble the old splash.

### V2 — Welcome / onboarding (new first impression)
Rebuild the onboarding flow. New composition: **full-bleed vertical, one idea per screen** — a large
serif prompt anchored high, answers as **low-chrome rows or soft chips in the thumb zone** at the
bottom, the living gradient shifting hue subtly per step. Progress = a quiet hairline, not dots-as-
pressure. No autofocus, no country ask, 18+ gate gentle, Help reachable before consent. This is the
screen a therapist/reviewer judges first — it must feel considered and calm, and must NOT be the old
centered card-stack.

### V3 — Card & tile language (retire the uniform box)
Define the new container system and apply app-wide:
- **Hero** = a full-bleed section with hairline separators + the living layer, NOT a boxed card.
- **Primary action** = large serif line + ONE quiet accent action; secondary is a plain text button.
- **Lists/choices** = editorial **ruled rows** (label · meta · chevron), NOT a grid of identical
  tiles. Where tiles are truly right (e.g. a 2-up), they use the elevation ramp, not borders.
- Kill the "every card is the same rounded rect on ground" feel measurably (the v6 complaint).

### V4 — Now tab
Recompose from the new language: a calm greeting, the arrival check-in as ruled options (not a chip
blob), one living-layer focal suggestion, the rest as a quiet section list. Above the fold = 3–4
distinct things with clear hierarchy, none of them a clone of another.

### V5 — Calm tab
The technique/experience library as an **editorial browse** — sectioned, filterable, ruled rows with
purpose, one featured living-layer hero. Not a wall of identical cards.

### V6 — You / Journal / People tabs
Each gets its OWN composition from the new language (the v6 "34 of 46 surfaces are the same sheet"
problem). Journal = the book (keep the fixed flex editor, restyle to editorial). You = a calm profile/
insight page. People (Constellation) = its own spatial treatment.

### V7 — Navigation & chrome
New tab bar: thinner, blurred material, active-only emphasis, safe-area correct. New in-flow headers
(back affordance, title) consistent across pushed views and sheets. Sheets restyled to the new depth
ramp.

### V8 — Motion & signature moments
One easing curve everywhere. View Transitions on tab change + flow entry. The breath orb refined as
THE signature. Living-layer drift wired to context. Press feedback unified. All reduced-motion + Still
preset parity proven.

### V9 — Redesign QA + before/after
Regenerate the full gallery. Produce `REDESIGN-DIFF.md`: for every key screen, the v6.0.10 screenshot
beside the v7 screenshot, confirming each is visibly, intentionally different. All Playwright + safety
tests green. Versions aligned, docs current. THEN stop.

---

## Acceptance (the anti-"looks the same" gate)
A phase is done ONLY if its screen no longer matches the v6.0.10 gallery image for that screen. If it
matches, the redesign didn't happen — redo it. Depth, hierarchy, and the living layer must be visible,
not just token values. No screen keeps the boxed-hero + chip-row + two-tile skeleton by default.

## Guardrails (unchanged, non-negotiable)
Offline/vendored only, no network, ES5, `el()`. Safety kernel + hard-coded number-free Help + 18+ gate
intact; docs/app.js ↔ backend safety-gate kept in sync if touched. No crisis numbers, no country
picker. Worth-returning-to, NOT addictive — no streaks/variable-reward/guilt. About/Legal keeps the one
honest not-medical line. Nothing marked clinically reviewed. Living layer must stay GPU-cheap and
degrade on weak devices (capability probe) — never janky, never a battery sink.

---

## V10 — REGRESSION: journal editor still voids (measured v7.0.4, blocker)

Opening a Blank-page entry, the writing area collapses and the void returns. Measured live:
- `.je-body` textarea: `flex-grow:1`, `line-height:34px`, but **computed height = 6px** (placeholder
  text clipped through the middle). Toolbar floats; large dead space below.
- Ancestor chain: `.je-body` (6px) → `.je-paper` (`display:flex; flex-direction:column; flex-grow:1`
  but **height = 30px**) → `.on` (`display:flex; flex-direction:column; height = 812px`).
- Root cause: `.je-paper` is NOT expanding inside `.on`. `flex:1` was placed on the textarea, but the
  break is one level up — `.je-paper` either shares `.on` with siblings (header/toolbar/prompt block)
  that consume the column and it lacks `flex:1 1 0; min-height:0`, or `.on` is not the intended editor
  flex column. Fix the CHAIN: the editor screen root must be `display:flex; flex-direction:column;
  height:100%`, header `flex:none`, **`.je-paper` `flex:1 1 0; min-height:0`**, `.je-body`
  `flex:1 1 0; min-height:0; height:100%`, toolbar `flex:none` pinned keyboard-safe. No fixed heights.
- **Guard test (add, must fail before fix, pass after):** open a blank entry on mobile viewport;
  assert `.je-body` bounding height ≥ 55% of the editor screen height at 0, 1, and 20 lines of text.
  This is the coverage gap that let the void ship through 314 green tests twice.

Same loop protocol: fix → the guard test goes green → bump all 4 version fields → doc → gallery →
commit → push.

---

## V11 — journal void: TRUE root cause (v7.0.5 fix missed it, still voids)

The v7.0.5 flex-chain fix is correct but does NOT fix the void. Live measurement on a fresh blank
entry (SW + caches cleared, real build):
- `#journalEditor` (flex column, 812px) children: `.je-top` 69px · `.je-paper` **30px** · `.je-tools`
  **1040px** · hidden input 0.
- `.je-tools` children: five `.je-tool` 48px, `.je-mood` 48px, and **`.je-emotion-wrap` = 1016px,
  `display:block`** — a feeling/emotion picker rendered INLINE and expanded inside the toolbar.
- `.je-tools` is `flex:0 0 auto` (won't shrink) and computed **`max-height:none`** — the v7.0.5
  `max-height:40vh` rule is being overridden, so it never clamps. Even if it clamped, `flex:none` +
  a 1016px inline panel still starves `.je-paper` (→30px → `.je-body` 6px, placeholder sliced).

**Root cause:** the emotion/feeling picker (`.je-emotion-wrap`) lives as a tall inline sibling in the
toolbar flex column instead of being an on-demand overlay. It consumes the editor's vertical space.

**Fix:**
1. `.je-emotion-wrap` must NOT be an inline flex sibling of `.je-body`/`.je-paper`. Render it as a
   **popover/overlay** (`position:absolute` or `fixed`, above the toolbar), `display:none` when closed,
   shown only when the feeling tool is tapped. Closed state contributes ZERO height to the column.
2. `.je-tools` = a single fixed-height row (~64px incl. safe-area), `flex:none`, `overflow-x:auto`
   for the icon row only. Remove the ineffective `max-height:40vh` (computed `none` anyway) and find
   the rule overriding it.
3. Re-confirm live: on a blank entry with the feeling picker CLOSED, `.je-body` height / editor height
   ≥ 0.55. Measured target, not assumed.

**Guard test is FALSE-GREEN — rewrite it.** 314 passed but live ratio is 0.2. The test must:
- open a real blank entry through the actual New-entry → Blank-page path (the same DOM that mounts
  `.je-emotion-wrap`),
- assert `.je-emotion-wrap` is `display:none` / zero-height while closed,
- assert `.je-tools` bounding height ≤ ~72px while closed,
- assert `#jeBody` height / `#journalEditor` height ≥ 0.55 at 0/1/20 lines.
It must reproduce ratio≈0.2 on today's build (fail), and pass only after the overlay fix.

Same loop: fix → test truly fails-then-passes → bump 4 version fields → doc → gallery → commit → push.

---

## V12 — journal void STILL failing at v7.0.7 (measured live, overlay never built)

**Shipped in 7.0.8** (`soulcap-v708`): true `position:fixed` overlay; base `display:none!important`
until `.on`; new entry opens CLOSED (`hidden`); V12 guard asserts closed `display:none` + out-of-flow
+ body/editor ≥0.55 + open does not shrink `#jeBody`. Live (SW+caches cleared): ratio ≈0.63,
`bodyDelta=0`. Broken in-flow probe fails (`display:block`, h≈386).

v7.0.7 fixed only the toolbar (`.je-tools` now 72px, good). The emotion picker fix from §V11 was NOT
done. Measured live on a fresh blank entry (SW+caches cleared) **before 7.0.8**:
- `#jeBody` = 202px, `.je-paper` = 303px, `.je-tools` = 72px, `.je-emotion-wrap` = **356px**,
  `#journalEditor` = 812px → **#jeBody / editor = 0.25** (target ≥ 0.55). FAILS.
- `.je-emotion-wrap`: `position:static`, in-flow child of `#journalEditor`, `display:block` and
  **visible by default** (`classList.contains('on')` is false, yet it still renders — the base
  `.je-emotion-wrap` rule lacks `display:none`). So it always occupies ~356px of the editor column
  above the writing area.

Root problems remaining (pre-7.0.8):
1. `.je-emotion-wrap` still lives IN the flex column (position:static). It must become a true overlay
   (`position:absolute`/`fixed`, anchored above the toolbar, its own scroll), so its open/closed state
   NEVER changes `.je-paper`/`#jeBody` height.
2. It defaults to OPEN/visible. Base rule must be `display:none`; only `.je-emotion-wrap.on` shows it;
   a new entry opens with it CLOSED.

Definition of done (verify LIVE, not by green test): on a fresh blank entry with the emotion picker
closed, `#jeBody` height / `#journalEditor` height ≥ 0.55, and opening the picker does NOT reduce
`#jeBody` height (overlay, not inline). The guard test is STILL false-green (passes at 0.25 reality) —
it must assert the picker is `display:none` on open AND that `#jeBody` ratio ≥ 0.55 with picker closed,
must FAIL on today's 7.0.7 build, and pass only after the overlay is built.
