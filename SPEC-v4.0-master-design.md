# SPEC v4.0 — Master design specification (the definitive build guide)

> **The assignment: design and build SoulCap as if a top product studio were making a new therapy
> app from a blank page — every screen, every sheet, every option, every word.** This document
> supersedes and absorbs `SPEC-v3.1-screen-layouts.md`. It is the single source of truth for the
> product's design. Work at highest effort, PR by PR, inside `AGENTS.md` rules (offline, local-only,
> ES5, tokens, `el()`, tests, cache bump, CI-green). **Engines are preserved and re-linked — this is
> a redesign of everything the user sees, not a rewrite of the logic.**

**State at time of writing:** v3.0.1. Amethyst tokens shipped. Layout work (`v3.1`) not yet built.

---

## 0. The two structural problems (measured, and why it all feels the same)

1. **One card size per screen.** Now = 1 card @343px · Calm = 5 @166px · You = **11 @343px**. Zero
   size variation anywhere. No hero, no hierarchy.
2. **Everything is a bottom sheet.** The app has **7 views + 5 overlays + 34 sheets = 46 surfaces**,
   and ~34 of them are the *same* bottom sheet. Every action feels identical because it is.

**Fix both or nothing changes.** §3 gives a presentation model (not everything is a sheet); §5 gives
a composition system (not everything is a stack).

---

## 1. Product personality

SoulCap is a **quiet, private room** — not a clinic, not a toy, not a dashboard for optimising
yourself. It should feel like a well-made physical object: calm, warm, unhurried, exact.

- **Serious but soft.** Real clinical substance, delivered kindly.
- **Unhurried.** Nothing rushes, nothing nags, nothing celebrates loudly.
- **Honest.** It says what it is and what it isn't, always.
- **Personal.** It's *your* room — your name, your book, your people, your words.

Three words to design against: **calm · crafted · trustworthy.** If a screen isn't all three, it
isn't done.

---

## 2. Design system (complete)

Keep the **Amethyst** palette from v3.0 (`--ground #14121A`, `--surface #1E1B29`, `--accent #8B7CF0`
dark; `#F5F3F8 / #FFFFFF / #6D5DD3` light; plus night/AMOLED + themed variants). Formalise the rest:

**Type scale** (one scale, no ad-hoc sizes) — serif `--voice` = the app speaking; sans `--ui` = chrome.
`display 34/1.15` · `title 26/1.25` · `heading 20/1.3` · `body 17/1.6` · `callout 15/1.5` ·
`label 13/1.4 +0.06em uppercase` · `micro 11/1.3` (chrome only). Body never below 15.

**Spacing scale:** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64. Nothing off-scale.
**Radii:** `sm 10` (chips/inputs) · `md 16` (tiles) · `lg 24` (cards/heroes) · `xl 32` (sheets) · `pill`.
**Elevation:** ground → card (`surface` + hairline + shadow-1) → raised (`surface-2` + shadow-2).
Dark elevates with *light*, never reused light shadows.
**Motion:** `fast 160ms` (press/feedback) · `base 260ms` (transitions) · `slow 420ms` (screen).
One easing, ease-out, no overshoot. Reduced-motion → opacity-only ≤90ms.
**Depth:** ~3% grain on `--ground`; low-alpha ambient accent glow on hero bands only.
**Icons:** one family, 1.75px stroke, 24px grid, rounded caps. No mixed weights, no emoji as UI.
**Illustration:** abstract, soft, low-contrast gradient forms per category (breath/rest/clarity/
move/warmth/connect/reflect). Never cartoon mascots, never stock photography of sad people.

---

## 3. Presentation model (fixes "everything is a sheet")

Choose by **task weight**, not habit:

| Presentation | Use for | Examples |
|---|---|---|
| **Tab view** | The 5 permanent homes | Now · Calm · Journal · People · You |
| **Full-screen flow** | Focused, multi-step, emotionally-loaded | Guided Path, Screener run, Runner, Panic, Journal editor, Onboarding |
| **Pushed subview** (in-tab, with back) | Reading / browsing depth | Technique detail, Experience detail, Article, Library, Manual, Safety plan, Timeline |
| **Bottom sheet** | Quick, single-purpose edits | Person, Add person, Ring name, Cover, Voice, Park a thought, Reset edit |
| **Inline expand** | Micro choices | Estimate confirm, small toggles, "why this?" |
| **Full-screen takeover** | Safety only | Panic / Help |

**Rule: no more than ~8 bottom sheets in the whole app.** Reassign the other ~26 to the rows above.
A pushed subview needs a lightweight in-tab stack (`pushView(id)` / back) — add it to the router.

---

## 4. Navigation model

Five tabs, permanent. Within a tab: **push** for depth, **back** returns, scroll position preserved.
Help is always reachable (header icon on calm screens, floating pill where the layout allows, never
covering content). No modal traps: every full-screen flow has a visible, non-guilting exit.

---

## 5. Composition system (fixes "one card size")

**No screen may be one repeated card size.** Every screen uses the bento tiers:
- **Tier 1 hero** — one per screen. Large (2:1 or 4:3), rich (viz / gradient / full-bleed).
- **Tier 2 utility** — medium, often 2-up, may be asymmetric.
- **Tier 3 micro** — stat pills, compact list rows.

Devices: **horizontal rails** for sets · **data-viz heroes** · **full-bleed** bands · **list rows**
instead of card walls · varied aspect ratios.

---

## 6. Component library (build once, compose everywhere)

`hero-band` (full-bleed, gradient+grain) · `hero-tile` · `tile` (1:1 / 2:1 / 3:4) · `rail`
(snap-scroll + "see all") · `list-row` (leading icon, title, meta, chevron) · `stat-tile`
(label + mini-viz) · `section-label` · `card` · `sheet` · `chip` (selectable) · `button`
(primary / secondary / quiet / destructive) · `input` · `textarea` · `slider` · `segmented` ·
`toggle-row` · `empty-state` · `notice` · `redflag-panel` (emergency / see-doctor) · `progress-ring`
· `sparkline` · `glass-pill` · `nav-header` (title + back + action) · `tab-bar` · `toast`.

Every one needs: rest / press / focus-visible / selected / disabled, in all themes.

---

## 7. Complete surface inventory & direction

### 7.1 First run
| Surface | Presentation | Direction |
|---|---|---|
| **Splash** | overlay | Mark centred on gradient+grain; one ambient breath; crossfade out. No flash. |
| **Welcome** | view | Full-bleed gradient; large centred lockup; one line of promise; **Begin** (primary); "I need help now" as a quiet text link, not a competing red block. |
| **Onboarding** | full-screen flow | One question per screen, slim progress bar, generous type, skippable, Help in header. Steps: age 18+ · name · consent/privacy · what's been hard (chips). |

### 7.2 Now — the flagship
Hero band (date + greeting + arrival chips, full-bleed, ambient) → **hero tile** (the one suggestion:
name, domain, duration, the "because…" reason, single **Begin**) → 2-up utility (This week viz ·
Short path) → micro row (wind-down · notice what's happening) → quiet Explore.
*Copy:* greeting adapts by hour ("It's late, Shamikh."). Reason always present, always plain.

### 7.3 Calm — guided, then rails
Hero: "What do you need right now?" (6 needs as a rich picker) → rail **Fitted for you** (techniques)
→ rail **Understand what's happening** (24 experiences) → rail **Read** (8 articles) → quiet row:
supports · reset menu · path. Nothing is a wall of equal tiles.

### 7.4 Journal — the book
Full-bleed cover (spine + page-edge depth) → **timeline**: date rail left, entries as varied-height
paper slips (photo entries taller), month dividers → FAB-less "New entry" as a primary row.
Editor = full-screen flow: paper texture, ruled lines aligned to line-height, title, body, tools
(photo · prompt · sticker · mood · park · decorate), autosave, Save.

### 7.5 People — Constellation
Edge-to-edge map (taller, the star) with floating **glass-pill** controls (pace · rings · add).
Tap person → sheet (quick). Long-press ring → rename. Below: nothing — let the map breathe.

### 7.6 You — a dashboard, not a card wall
Full-bleed profile header (name, day count, quiet line) → **hero progress viz** (mood line + rings +
counts) → 3 stat tiles (Patterns · Weekly · Timeline) → **list rows** grouped:
*Your tools* (My plan · Personal manual · Principles · Screener) ·
*About you* (Profile · Your story · What SoulCap knows) · *Settings* (one row, foot).
This deletes 8 redundant rectangles.

### 7.7 Focused flows (full-screen)
- **Guided Path** — one question per screen; arrival → symptom chips → distortion chips →
  **approach result** (CBT / DBT / ACT / Behavioural Activation) with a warm "why" → its exercises as
  a rail. Hue shifts subtly per step. Never "you have X"; always "an approach you could try."
- **Screener run** — one item per screen, 4 response chips, progress bar, "not a diagnosis" always
  visible; result = band + kind interpretation + next step + link to experiences. PHQ item-9 → Help.
- **Runner** — orb-centred, countdown, step text, pace + voice controls, pause/next/stop.
- **Panic / Help** — calmest surface in the app: ambient full-bleed, huge type, pacer, gentle
  reach-out guidance (no numbers), one-tap exit.

### 7.8 Pushed subviews
Technique detail · Experience detail (what it is / why / what helps rail / self-care / reflection /
red-flag) · Article reader · Library · Personal manual · Safety plan · Emotional timeline ·
Patterns · What SoulCap knows.

### 7.9 Remaining sheets (keep ≤8)
Person · Add person · Ring name · Journal cover · Voice & accent · Park a thought · Reset edit ·
About. Everything else becomes a pushed subview or inline.

---

## 8. Every option (settings — complete)

**Appearance:** theme (Auto · Light · Dark · Night · Ocean · Forest · Rain · Space · Sunrise ·
Minimal · AMOLED) · accent (Plum · Lilac · Mulberry · Indigo) · text size · density · higher
contrast · reduced transparency.
**Language:** English · Roman Urdu (preview; clinical copy stays English until review).
**Guided exercises:** spoken guidance on/off · voice & accent · speed · pitch · vibration ·
exercise pace (Slow / Steady / Brisk).
**Constellation:** map pace (Still / Drift / Live) · rings 3–7 · show links · track last-spoken.
**Personalisation:** show short path on Now · wind-down hour · drip questions on/off · patterns on/off.
**Your data:** export everything · delete everything (with confirm) · storage note.
**About:** version · what's new · honesty statement ("self-help, not therapy; not clinically
reviewed") · credits.

Each is a `toggle-row` or `segmented` in a labelled group, with a one-line explanation beneath where
the meaning isn't obvious. No setting is unexplained.

---

## 9. Voice & copy

**Rules:** plain and warm · tentative not declarative ("Some people find…", never "You are…") ·
short sentences · one idea per line · no jargon without a gloss · buttons say what happens ·
errors calm and blameless · never guilt, never congratulate loudly, never claim to care.
**Consistency:** pick one word per concept and use it everywhere (audit *technique / exercise /
skill* → choose **technique**). Centralise all strings in `data.js` (`STRINGS`, `*_UI`) so the whole
voice is reviewable in one place.
**Safety copy is fixed** and must never be softened, reworded for style, or auto-generated.

---

## 10. States (design all of them)
**Empty:** every list/collection gets a warm one-liner + one action (Journal, People, Patterns,
Library, Timeline, Manual, Safety plan).
**First-run:** gentle explanation of what a surface will become.
**Loading:** everything is local — prefer instant; never a spinner for local reads.
**Error:** storage-full (journal photos) explained plainly with the fix; nothing lost.
**Offline:** a quiet, permanent reassurance, not an alarm.

---

## 11. Accessibility (non-negotiable)
Full VoiceOver labels/roles/focus order on every surface (especially Panic, Runner, Screener,
Editor) · Dynamic Type to 200% without clipping · reduced-motion parity everywhere · AA contrast in
every theme **including over gradients** · ≥48px targets · rails keyboard-navigable with "see all" ·
visible focus rings.

---

## 12. Safety (unchanged, verify after every PR)
Never diagnose · screeners say "not a diagnosis" · approach = "one to try" · tier-3 keyword Help on
all free-text saves · PHQ item-9 → Help · red-flag panels (emergency / see-doctor) intact and
prominent · "not clinically reviewed" banners stay · no crisis numbers, no country · app never
contacts anyone · offline/local-only preserved.

---

## 13. Build sequence (each PR shippable, green, cache bumped)

1. **PR-1 Foundations** — type/spacing/radii/elevation/motion tokens formalised; icon set unified;
   grain + hero-band; component kit §6 (hero-tile, tile, rail, list-row, stat-tile, full-bleed,
   glass-pill, nav-header).
2. **PR-2 Router** — pushed-subview stack + back + scroll restore. (Unblocks §3.)
3. **PR-3 Now** — hero band + hero tile + 2-up + micro row.
4. **PR-4 You** — dashboard hero + stat tiles + list rows; move ~8 sheets to pushed subviews.
5. **PR-5 Calm** — hero + three rails; Library/Experience/Article become pushed subviews.
6. **PR-6 Journal + People** — timeline + book cover depth; edge-to-edge map + glass pills.
7. **PR-7 Focused flows** — Guided Path, Screener run, Runner, Panic to full-screen one-step-at-a-time.
8. **PR-8 First run** — Splash, Welcome, Onboarding.
9. **PR-9 Copy pass** — centralise + rewrite every string to §9; one word per concept.
10. **PR-10 States + a11y + gallery** — empty/error states, VoiceOver, contrast over gradients,
    regenerate `npm run gallery`, review every shot.

---

## 14. Definition of done
Open the app cold. Within ten seconds it should read as a **premium, calm, purpose-built therapy
companion** — one coherent world, every screen shaped differently and deliberately, one warm voice,
nothing bolted on. Put the v3.0 gallery beside the v4.0 gallery: **different apps.** And it stays
honest — a self-help tool that knows exactly what it is, and says so.
