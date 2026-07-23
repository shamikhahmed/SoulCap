# SPEC v3.1 — Screen layouts (build guide for Cursor)

> **The problem, measured.** v3.0 landed the Amethyst tokens correctly — but the app still looks
> ~98% the same, because **every screen is the same composition: a heading, then a single column of
> identically-sized rounded cards.** Audit of the running v3.0.1:
>
> | Screen | Cards | Distinct card widths |
> |---|---|---|
> | Now | 1 | **343px only** |
> | Calm | 5 | **166px only** |
> | You | 11 | **343px only** |
>
> Eleven identical rectangles stacked on You. Zero size variation anywhere. **A new palette on an
> unchanged layout reads as "no redesign."**
>
> **This spec is about composition, not colour.** Keep the v3.0 tokens. Change the *shape* of every
> screen. Same rules as always (`AGENTS.md`): offline, ES5, tokens, `el()`, tests, cache bump,
> engines preserved.

---

## 0. The core rule: kill the uniform card stack

**No screen may consist of one repeated card size.** Every screen must show a deliberate hierarchy
using the **bento tier system** (the dominant modern pattern — Apple, and now most premium apps):

- **Tier 1 — Hero tile.** One per screen. Large, visually rich (data-viz, ambient gradient, or a
  full-bleed moment). It answers the screen's main question at a glance.
- **Tier 2 — Utility tiles.** Medium. Support the hero. Often 2-up, sometimes asymmetric (2:1).
- **Tier 3 — Micro tiles / rows.** Small status chips, stat pills, compact list rows.

Plus these devices, used deliberately (not everywhere):
- **Horizontal rails** for browsing sets (techniques, experiences, articles) — never a long vertical
  list of equal cards.
- **Data-viz as a hero** (rings, sparkline, calendar heat-strip) rather than a text card.
- **Full-bleed / edge-to-edge** elements that break the 16px gutter for emphasis.
- **Varied radii & aspect ratios** (a wide 2:1 hero, a 1:1 tile, a tall 3:4 feature).
- **Section rhythm**: label → content → breathing room; not card-card-card-card.

Reference patterns worth studying before building: **Mobbin** and **Pttrns** for real app screens,
**Dribbble / Behance / Muzli** for visual direction, Apple Health (data hierarchy), Calm (hero
imagery + rails), Headspace (friendly category tiles).

---

## 1. Now — the flagship screen

Today: greeting → chips → one 343px card → dots → button. Flat.

**Target composition:**
```
┌──────────────────────────────────────────┐
│  ambient gradient, full-bleed top        │  ← hero band (breathes, reduced-motion safe)
│  FRIDAY 24 JULY                          │
│  It's late, Shamikh.                     │  ← serif, large
│                                          │
│   ◗ how are you arriving?  [chips row]   │  ← inline, in the hero band
└──────────────────────────────────────────┘
┌────────────────── HERO TILE ─────────────┐
│  [ ~2:1, richest surface + inner glow ]  │
│  Getting back to sleep          REST     │
│  6 min · works offline                   │
│  "Because it's late."                    │
│  [ Begin ]                               │  ← the one filled action on the screen
└──────────────────────────────────────────┘
┌───── UTILITY (1:1) ─────┬──── UTILITY ───┐
│  This week              │  Short path    │  ← 2-up, unequal is fine
│  ●●●●●●○  6 days        │  a few taps →  │
│  (sparkline/dots viz)   │  something fit │
└─────────────────────────┴────────────────┘
┌──── MICRO ROW ──────────────────────────┐
│  Wind-down 21:00 ·  Notice what's up  →  │  ← compact, quiet
└──────────────────────────────────────────┘
```
- Hero band is **full-bleed** (breaks the gutter) with the greeting + check-in inside it.
- The suggestion is a genuine **hero tile**: larger, richer surface, inner glow, more padding.
- "This week" becomes a **small data-viz tile**, not a text line.
- Everything else compresses into a 2-up row + one micro row. Explore folds in.

## 2. Calm — browsing, so use rails

Today: 5 equal 166px cards in a grid. Reads like a menu.

**Target:**
```
  What do you need right now?          ← section label
┌──────────── HERO ────────────────────┐
│ [ current-need tile, 2:1, illustrated │  ← the guided "what do you need" entry
│   or gradient per need category ]     │
└───────────────────────────────────────┘
  Fitted for you            (see all →)
  ◄ ▢▢ ▢▢ ▢▢ ▢▢ ►                        ← HORIZONTAL RAIL of technique cards (1:1 or 3:4)
  Understand what's happening
  ◄ ▢▢ ▢▢ ▢▢ ►                            ← rail of experiences (24 clinical entries)
  Read
  ◄ ▢▢ ▢▢ ►                                ← rail of articles/library
  Also here:  supports · reset · path      ← quiet text row, not cards
```
- Each **rail** scrolls horizontally, cards ~150–170px wide, with a category colour/icon.
- Kills the "wall of equal tiles" completely.

## 3. You — from 11 identical cards to a dashboard

Today: 11 × 343px cards. The worst offender.

**Target — a real dashboard:**
```
┌──── PROFILE HEADER (full-bleed, gradient) ────┐
│  ◍  Shamikh                                    │
│     day 42 · quiet progress                    │
└────────────────────────────────────────────────┘
┌────────── HERO: PROGRESS ──────────────────────┐
│  [ the dashboard viz — mood line + rings ]     │  ← Tier 1, ~4:3
│  calm ▁▂▃▅▃▂  ·  12 exercises  ·  8 entries    │
└────────────────────────────────────────────────┘
┌── 1:1 ──┬── 1:1 ──┬── 1:1 ──┐
│ Patterns│ Weekly  │ Timeline│                    ← Tier 2, 3-up micro-tiles w/ tiny viz
└─────────┴─────────┴─────────┘
  Your tools                                       ← section label
  ▸ My plan        ▸ Personal manual                ← compact LIST ROWS (not cards)
  ▸ Screener       ▸ Principles
  About you                                        ← section label
  ▸ Profile   ▸ Your story   ▸ What SoulCap knows
  ⚙ Settings                                       ← single row, foot
```
- Cards only for the hero + the 3 stat tiles. **Everything else becomes list rows** — that alone
  removes 8 redundant rectangles and makes the screen scannable.

## 4. Journal — make the book the hero
- **Full-bleed cover** at top (already good) — enlarge, add spine depth + subtle page-edge.
- Entries as a **timeline**, not equal cards: date rail down the left, entries as varied-height
  paper slips (photo entries taller, text-only shorter). Month dividers.

## 5. People (Constellation) — full-bleed the map
- Map goes **edge-to-edge**, taller (it's the star). Controls become a floating glass pill over it,
  not stacked cards below. Person list (if shown) is a horizontal rail of avatars.

## 6. Guided Path — conversational, one question per screen
- Today it's a sheet with everything stacked. Make it a **full-screen, one-step-at-a-time flow**
  with a slim progress bar, large serif question, chips as generous targets, and a soft ambient
  background that shifts hue per step. It should feel like a calm conversation, not a form.
- The approach recommendation is a **hero result card** (the "why" prominent), then its exercises as
  a rail.

## 7. Experience detail / Runner / Panic
- **Experience**: hero band with the experience name + group colour, then *what it is / why / what
  helps* as distinct sections (rail of helping techniques), red-flag panel visually unmistakable.
- **Runner**: already good (orb-centred, full-screen) — keep; add ambient hue per technique family.
- **Panic**: calmest of all — full-bleed ambient, huge type, the pacer as the only focus.

## 8. Splash / Welcome
- **Splash**: mark centred, ambient glow breathing once, then a smooth crossfade (no flat flash).
- **Welcome**: centre the lockup over a **full-bleed gradient**, value line beneath, one confident
  **Begin**; Help becomes a quiet text link, not a competing red block. Fill the empty middle with
  depth (gradient + grain), not blank space.

---

## 9. Component additions needed
`hero-tile`, `tile` (1:1 / 2:1 / 3:4 variants), `rail` (horizontal scroller w/ snap), `list-row`,
`stat-tile` (label + mini-viz), `full-bleed` wrapper (breaks gutter safely), `glass-pill` (floating
controls over the map), `section-label`. Build them once in the kit; compose every screen from them.

## 10. Guardrails
- Rails must be keyboard/screen-reader navigable and show a scroll affordance; never hide content
  only reachable by horizontal scroll without a "see all".
- Full-bleed elements still respect safe-area insets.
- Reduced-motion: ambient gradients become static; rails don't auto-scroll (they never should).
- Contrast AA in every theme on the new gradient surfaces (check text over gradients!).
- Tap targets ≥48px, body ≥15px, one filled action per screen — unchanged.
- **Do not change engine logic or copy meaning** — this is composition only. Safety surfaces
  (Help, red-flags, not-reviewed banners) must remain equally prominent or more so.

## 11. Sequencing
1. **PR-1** component additions (§9) — hero-tile, tile variants, rail, list-row, stat-tile, full-bleed.
2. **PR-2 Now** (§1) — hero band + hero tile + 2-up + micro row.
3. **PR-3 You** (§3) — dashboard hero + 3 stat tiles + list rows (biggest visible win).
4. **PR-4 Calm** (§2) — rails.
5. **PR-5 Journal + People** (§4, §5) — timeline + full-bleed map.
6. **PR-6 Guided Path + Experience + Welcome/Splash** (§6, §7, §8).
7. **PR-7** gallery regen + a11y + contrast sweep on gradients.

After each: CHANGELOG, bump CACHE/VERSION/APP_VERSION, `npm run verify` green, push.

## 12. Definition of done
Put the v2.1 screenshots next to the new ones: **they should look like different apps.** No screen
is a uniform stack; each has one clear hero, varied tile sizes, and at least one deliberate device
(rail, viz, or full-bleed). Someone flicking through the gallery should be able to name each screen
from its shape alone.
