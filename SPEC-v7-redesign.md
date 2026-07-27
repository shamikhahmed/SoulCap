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
