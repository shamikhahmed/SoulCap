# SPEC v3.0 — The redesign (build guide for Cursor)

> **The assignment: make SoulCap look and feel like a flagship product a senior Apple / Calm /
> Fable team shipped — a cohesive, premium, purple design system and a unified information
> architecture — WITHOUT throwing away the engines.** This is a *reskin + reorganise*, not a
> rewrite. Every existing engine (techniques, clinical experiences, screeners, Guided Path, safety
> kernel, journal, Constellation, patterns, user model) is **preserved and wired together**.
> Work at highest effort. Stay inside `AGENTS.md` rules (offline, no network, ES5, tokens, `el()`,
> tests, cache bump, CI-green).

The app is at **v2.1.0** and is *functionally* strong and safe. The honest problem is **visual +
structural craft**: the palette is muddy, cards barely separate from the background, the accent is
too neon/toy-like, sheets and the welcome/splash are plain, the Help FAB overlaps content, and the
many engines don't feel like *one* product. v3.0 fixes exactly that.

**What this spec does NOT change:** the data (`SKILLS`, `EXPERIENCES`, `SCREENERS`, `GUIDED PATH`
families, journal, Constellation, patterns), the safety kernel, offline behaviour, the honesty
banners, or the "not an AI therapist / never diagnose" identity. Reskin the surfaces; keep the soul.

---

## 0. Non-negotiable framing (read first)
- **Preserve engines, redesign the shell.** If a change would delete/rewrite working engine logic,
  stop — that's out of scope. Refactor presentation, not the safety/recommendation logic.
- **Never diagnose. Screening & recommendation = reflection**, always "not a diagnosis", crisis
  routing intact (tier-3 Help, PHQ item-9). Red-flag panels stay.
- Everything the redesign touches must keep AA contrast in every theme, honour reduced-motion, and
  keep tap targets ≥48px.

---

## 1. Design language v3 — "Amethyst" (the core of the redesign)

Grounded in current premium-wellness practice: **surfaces < ~30% saturation, accents ≤ ~55%**,
depth by **elevation (lighter surfaces in dark) + soft shadow + hairline**, a **subtle noise/grain**
overlay for warmth (clinical → human), and **calm ambient gradients** on hero surfaces only.

### 1a. Token palette (recommended — tune each for AA, keep as CSS custom properties)
**Dark (primary — the app is dark-first premium):**
```
--ground      #14121A   deep indigo-plum, low sat (NOT muddy brown)
--surface     #1E1B29   cards — clearly lighter than ground (elevation = lightness)
--surface-2   #272334   raised / grouped / sheets
--line        rgba(236,233,244,.08)     --line-strong rgba(236,233,244,.14)
--ink         #ECE9F4   --ink-2 #A8A2BC   --ink-3 #726C86
--accent      #8B7CF0   refined violet (mid-sat, NOT neon lilac)
--accent-press#6D5DD3   --accent-ink #14121A   --accent-soft rgba(139,124,240,.14)
--accent-grad linear-gradient(135deg,#8B7CF0,#6D5DD3)   (primary buttons only)
--shadow-1    0 1px 2px rgba(0,0,0,.35)         (card rest)
--shadow-2    0 8px 30px rgba(0,0,0,.45)        (raised / sheets / FAB)
--glow        radial ambient behind hero, very low alpha accent
```
**Light:** `--ground #F5F3F8` (soft lilac-white) · `--surface #FFFFFF` · `--surface-2 #F0ECF7` ·
`--ink #201C2B` · `--accent #6D5DD3` · shadows softer. Keep Night + the themed variants (Ocean…)
but re-derive them from this system so they share the same *elevation and contrast story*.

The single biggest visual fix: **cards must read as raised** — lighter `--surface` than `--ground`
+ a hairline + `--shadow-1`. Today they nearly vanish into the background. Fix that everywhere.

### 1b. Elevation ladder
ground → card (surface + hairline + shadow-1) → raised/sheet (surface-2 + shadow-2). Consistent
app-wide. Dark elevates with *light*, never reused light-mode shadows.

### 1c. Depth & warmth
- A faint **grain/noise** overlay (CSS, ~2–4% opacity) on `--ground` to kill the flat/clinical feel.
- **Ambient accent glow** behind the hero on Now, the Guided Path header, and Panic — subtle,
  low-alpha, static under reduced-motion.

### 1d. Type
Keep serif (`--voice`) = the app speaking, sans (`--ui`) = chrome. Tighten to one scale, balance
headings, generous line-height on body. Body ≥15px; compact chrome only per `.cursorrules`.

### 1e. Motion
One easing (ease-out, no overshoot), token durations. Choreograph view/sheet/card/tab transitions
as one system. Reduced-motion → opacity-only ≤ ~90ms. Ambient motion (glow breathing, orbit) is the
only continuous motion, always freezable.

### 1f. Buttons & the FAB
- Primary = `--accent-grad`, confident but **not glowing/neon**; one filled action per screen.
- Secondary = outline; quiet = text.
- **Fix the Help FAB overlap**: it currently sits over content and the tab bar. Reposition so it
  never covers a card or the nav (e.g. integrate Help into the header of stressful screens, or a
  safe-area-aware FAB that yields to the tab bar). Help must always be reachable in one tap.

---

## 2. Information architecture — make it feel like ONE product

Keep **five tabs** (Now · Calm · Journal · People · You) — the count is right. Redesign so each has
a clear job and the engines visibly connect. The unifying idea: **one adaptive core** feeds
personalised suggestions across the whole app.

### 2a. The linking map (make this real, not implied)
```
                     ┌─────────────── the adaptive core (local user model) ───────────────┐
 check-ins ──▶       │  signals: arrival words, detailed dims, triggers, screener bands,   │
 detailed dims ──▶   │  technique feedback, experiences viewed, path families, journal     │
 screeners  ──▶      │  moods. All low-confidence, user-visible & correctable.             │
 technique ratings ─▶└───────────────┬───────────────────────────────────────────────────┘
                                      │ drives
      ┌───────────────────────────────┼───────────────────────────────┐
   Now suggestion            Guided Path recommendation        Calm "what you need" order
   (one skill, with reason)  (feeling→symptoms→approach→        (fitted skills first)
                              exercises)
```
Every surface should show *why* it suggested something ("because you saved it / it's late / you
told the path you're wired"). Feeling → Guided Path → approach → **its exercises open the runner** →
runner feedback → back into the core → next suggestion adapts. Experiences link to techniques;
screeners link to relevant experiences + approaches; Constellation links to the safety plan. Nothing
is a dead end.

### 2b. Per-tab jobs
- **Now** = "how am I, and one good next step." Hero greeting + check-in + **one** primary suggestion
  + a calm progress glance. Everything else (path, experience picker, wind-down, drip) is quieter,
  below, or folded into an "Explore" affordance.
- **Calm** = the guided library. "What do you need?" → fitted skills; browse-all + experiences +
  articles + supports one level down, cleanly grouped (not a flat pile).
- **Journal** = the book (already strong — reskin to the new elevation/warmth).
- **People** = Constellation (already strong — reskin, keep the orbit).
- **You** = identity + insight + tools + settings, in the 4 grouped sections that exist. Add the
  **Progress dashboard** here (see §4).

---

## 3. Screen-by-screen redesign brief

Each keeps its function; the brief is the *look/feel/layout* upgrade.
- **Splash** — logo lockup centred with a single ambient breath of the glow, correct theme pre-paint,
  smooth handoff. No flat flash.
- **Welcome** — richer: the mark larger and centred as a focal lockup over a soft ambient gradient;
  the value line; one confident **Begin**; Help as a quiet link, not a loud red button competing
  with Begin. Fill the empty middle with calm depth, not blankness.
- **Onboarding** — one idea per card, progress dots, generous spacing, skippable, Help reachable.
- **Now** — the flagship screen. Warm hero (greeting + optional ambient glow), a **beautifully
  elevated** suggestion card with a clear reason and one primary action, a compact progress glance
  (streak-free — a gentle line/rings of *this week*, no scores), then quiet Explore.
- **Guided Path** (your sister's feature) — see §4; make it feel conversational and warm, not a form.
- **Experience detail / screeners / runner / panic** — reskin to the new card/sheet system; panic
  gets the calmest treatment (ambient, minimal, big type, the pacer).

Regenerate the **screen gallery** (`npm run gallery`) after and judge every shot against the
flagship bar.

---

## 4. The assessment → recommendation engine (fold in the therapist's brief)

Your therapist sister's feature = **already mostly built** as the Guided Path (v2.1: feeling →
symptom chips → family "why" → Begin) and the queued approach-packs (v2.2). v3.0 completes it to
match her brief, safely:

1. **Select feeling** (anxious / low / stressed / overwhelmed / emotionally low) — arrival chips.
2. **Brief interactive assessment** — a few evidence-based **symptom chips** across emotional /
   cognitive / behavioural / physical (reuse the 24 `EXPERIENCES` + cognitive-distortion chips:
   catastrophising, black-and-white, mind-reading, overgeneralisation). **Chips only, no free text**
   in the core flow (keeps the keyword kernel sufficient). Cap the number of taps; keep it light.
3. **Rule-based recommendation of an APPROACH, not a diagnosis:** map symptom patterns →
   **CBT** (excessive worry, distortions) · **DBT** (emotion-regulation/overwhelm) · **ACT**
   (avoidance, difficulty accepting emotion) · **Behavioural Activation** (low mood, withdrawal).
   Explain **why** in warm, plain language ("You mentioned a lot of 'what if' thinking — an approach
   called CBT works on exactly that. Not a diagnosis, just a good fit to try.").
4. **Immediately offer that approach's exercises** — thought record, breathing, 5-4-3-2-1, PMR,
   mindfulness, journaling prompt, mood check, a tiny daily action — all from existing `SKILLS`
   (build the approach→skills mapping in `data.js`; verify ids exist). Opening one launches the runner.
5. **Progress dashboard** (new, in You): mood over time, symptom-severity trend (from optional
   check-in dims + screeners), exercises completed, and *gentle* improvement over weeks — **no
   scores, no streaks, no gamification**. Recommendations get more personalised as data grows
   (from the adaptive core §2a).
6. **Every recommendation carries the disclaimer**: educational self-help, not a replacement for
   professional assessment/therapy. **Severe distress / self-harm signals → prioritise crisis
   guidance** (existing hard-coded Help; PHQ item-9). Never "start therapy"; always "an approach
   you could try."
7. Conversational, empathetic tone — not clinical. It should feel like a kind, informed friend.

This is the spec for **`SPEC-v2.2-approach-packs.md`** brought into the redesign — build the approach
mapping + the progress dashboard here, styled in the v3 system. Keep the "path copy not clinically
reviewed" banner.

---

## 5. Component library (unify — build/confirm these as the shared kit)
Card, raised card, bottom sheet, chip (selectable), primary/secondary/quiet button, list row,
input/textarea, slider, segmented control, section header, empty state, notice/red-flag panel,
progress ring/line, tab bar, FAB. One look each, from tokens, with all states (rest/press/focus/
selected/disabled). Every screen composes from these — kill the drift between older and newer screens.

---

## 6. "Frontend + backend linked" — what that means here
The shipped app is **offline, local, no network** — that stays (it's the privacy promise and the
identity). "Linking everything" means the **engines inside the PWA** feed one adaptive core and one
consistent UI (§2a) — not wiring the Nest `backend/` lab (which remains un-deployed). If the owner
ever wants accounts/sync, that's a separate, opt-in, encrypted, post-v3 decision with its own safety
review — do **not** add it in this pass.

---

## 7. Sequencing (each PR shippable, green, cache bumped)
1. **PR-1 Design tokens v3** — new palette, elevation ladder, grain/glow, shadows, button/FAB fix.
   Apply globally via tokens; no structural change. Instantly lifts every screen. Verify AA + all
   themes re-derived.
2. **PR-2 Component kit** (§5) — unify card/sheet/chip/button/row/input/empty states.
3. **PR-3 Now hero + progress glance** redesign (§3) + FAB placement.
4. **PR-4 Splash / Welcome / Onboarding** redesign (§3).
5. **PR-5 Calm + Journal + People + You** reskin to the kit; You gets the **Progress dashboard** (§4).
6. **PR-6 Guided Path → approach recommendation + exercises** completion (§4), styled in v3.
7. **PR-7 a11y + gallery regen + copy polish sweep**; confirm one voice, one system.

After each: CHANGELOG; bump `sw.js` CACHE + `VERSION.json` + `APP_VERSION`; bump SAFETY/HANDOVER;
`npm run verify` reliably green; push; confirm live cache.

## 8. Guardrails (every PR)
- Preserve engines & data; reskin only. No engine rewrite, no deleted safety logic.
- No network/deps/ES6; tokens not hardcoded colours; `el()` builder; content in `data.js`.
- Never "you have X"; recommend an *approach* with "why" + "not a diagnosis"; crisis routing + red
  flags + not-reviewed banners intact; Help always one tap and never covered.
- AA contrast every theme; reduced-motion parity; ≥48px targets; ≥15px body.
- Add/keep tests for anything safety-critical; suite reliably green; cache bumped.

## 9. Definition of done for v3.0
A stranger opens SoulCap and, within seconds, believes a serious studio built it: one cohesive
purple world, cards that feel real, calm depth, a warm voice, and every engine visibly connected —
feeling → a fitting approach → an exercise → progress — while staying honestly a self-help tool, not
a doctor. It should look like it belongs next to Calm and Headspace in the App Store, and be
unmistakably its own.
