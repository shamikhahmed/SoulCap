# AUDIT-v6 — SoulCap production audit (Phase A)

**Status:** SPEC-v6.0 A→J complete · **Date:** 2026-07-27 · **App (audit baseline):** v5.1.9 · **Shipped now:** v6.0.10 / `soulcap-v610` · **Schema:** v13  
**Scope:** read-only. No code changes in this phase. Sources: `docs/app.js` (~5294 lines),
`docs/app.css` (~1410), `docs/data.js` (~1899), `docs/index.html`, `docs/sw.js`, e2e.

---

## 1. `app.js` shape

Single IIFE, **309** `function` declarations. Partial section banners exist (Safety · State · DOM ·
Theme · Runner · Sheet · Journal · Constellation · Now · You · Router · Boot) but **no top-of-file
function index**. Nested helpers reuse names (`draw` ×5, `end` ×2) — local scopes, not collisions,
but hard to grep.

### 1.1 Largest surfaces (approx line span)

| Lines | Function | Role |
|------:|----------|------|
| 198 | `boot` | wire events, splash, SW |
| 146 | `renderCalm` | Calm tab |
| 143 | `renderMe` | You tab |
| 142 | `draw` (map) | Constellation SVG |
| 137 | `renderNow` | Now tab |
| 122 | `settingsSheet` | Settings |
| 89 | `renderJournal` | Journal tab |
| 78 | `checkinDetailSheet` | Check-in detail |
| 76 | `manualSheet` | Personal Manual |
| 75 | `knowsSheet` | What SoulCap knows |
| 72 | `load` | state hydrate |
| 71 | `personSheet` | Person detail |
| 69 | `renderOnboarding` | Onboarding |
| 66 | `coverSheet` | Journal cover |
| 65 | `migrateState` / `startJournalTranscription` | migrate / mic |

### 1.2 Category counts

| Bucket | Count | Notes |
|--------|------:|-------|
| `render*` | 16 | tabs + sub-renderers |
| `*Sheet` / open-close overlays | ~39 | sheets, panic, editor |
| runner / breath / orb | ~19 | paced + steps |
| safety | ~4 | `assessRisk`, panic wire |
| state load/save/migrate | ~9 | |
| other helpers | ~222 | DOM kit, chips, path, patterns, i18n |

### 1.3 Key ranges (for Phase B index)

- Safety kernel: L7–56 (`assessRisk`, tier-3 open)
- State: L57–263 (`DEFAULT`, `load`, `migrateState`, `save`)
- DOM kit: L264–363 (`el`, `$`, `clear`, composition helpers)
- Theme / motion / haptics: L364–659
- Voice: L660–721
- Check-ins / path / patterns / screener / drip: L803–1877
- Runner: L1878–2135
- Subview + sheet + gestures: L2136–2384
- Technique / library / calm helpers: L2385–3243
- Journal: L3244–3721
- Constellation: L3722–4183
- History / Now / plan / You: L4184–4933
- Welcome / onboarding: L4934–5023
- Router / demo / boot / `__soulcap`: L5024–end

---

## 2. Confirmed defects (SPEC §0) — still present

1. **Journal editor void** — `#journalEditor` is `display:flex` column but `.je-body` uses fixed
   `min-height` / no `flex:1` fill; toolbar not keyboard-safe pinned. Matches SPEC §0.1.
2. **Density** — heroes/tiles still roomy; no `--pad-card` / `--tile-min` density tokens yet.
3. **Theme overload** — `THEME_OPTIONS` still includes Rain/Space/Sunrise/Minimal; 4 accents;
   density/contrast/transparency/motion live under Appearance (not Accessibility group).

---

## 3. Dead / duplicate / cleanup candidates (Phase B)

| Item | Finding |
|------|---------|
| `console.log` | **0** in `app.js` |
| TODO/FIXME | **0** |
| `data.js` exports | **68** top-level `var`s; all referenced from `app.js` (no orphan exports) |
| CSS tokens defined but never `var(--…)` | Suspect unused / weakly used: `accent-grad`, `breath`, `ground-h`, `clarity`, `move`, `warmth`, `reflect`, `caution-ink`, `cover-edit`, `grain-opacity` (used as fallback), `data`, `dur-screen`, `motion-glow`, `space-4b`, `space-7` — verify before delete |
| Naming | `skill` / `Skill` dominate code (~100 hits); UI copy mixes **technique / exercise / skill**. SPEC B → one word: **technique** |
| Duplicate helpers | Multiple local `draw` / `end`; keep but rename in B if clarifying |
| Back-compat | Comment at ~L4774: Settings alias `toggleRow` — keep or fold |
| FAB | CSS `#fab.on` remains; runtime keeps FAB off main tabs — OK, do not revive pressure |

---

## 4. Offline / SW integrity

`index.html` loads: `app.css`, `data.js`, `app.js`, `icons/mark.svg`, manifest, apple-touch icon.  
`sw.js` ASSETS also precaches `vendor/gsap.min.js`, `vendor/breath-orb.js`, PNG icons — loaded
dynamically from `app.js` (orb/GSAP). **Match is good**; no CDN. Phase B should re-diff after any
asset add/remove.

---

## 5. Safety / clinical copy (do not weaken)

- Kernel lists in `app.js` must stay synced with `backend/.../safety-gate.service.ts`.
- Number-free Help, 18+ gate, tier-3 routing: intact.
- Per-sheet **"Not yet clinically reviewed"** still appears (`skillSheet`, Calm `CALM_REVIEW_NOTE`,
  path `reviewNote`, About credits). Owner + SPEC §13: **remove repeats**; keep **one** not-medical
  line in About/Legal. Do in C/E settings pass (not Phase A).

---

## 6. Design tokens / themes (Phase C/E)

- Themes in CSS: light, dark, night, ocean, forest, **rain, space, sunrise, minimal**, amoled.
- Owner cull: **DELETE** rain/space/sunrise/minimal (+ gallery variants + settings entries).
- Accents → **3** (currently plum/lilac/mulberry/indigo).
- Appearance primary: Auto · Light · Dark · Night; Ambient row Ocean · Forest; AMOLED keep.
- Accessibility group: text · contrast · transparency · motion (density per SPEC §11).
- ~343 hex literals and ~428 `px` decls in CSS — many belong in theme blocks; Phase E greps
  component hardcodes outside tokens.

---

## 7. Gallery / e2e

- Gallery matrix still shoots deleted themes — Phase C must drop Rain/Space/Sunrise/Minimal from
  `e2e/gallery.spec.ts` + regenerate.
- Playwright ~280+; breath phase timing recently hardened. Add tests later for journal flex,
  density, autofocus rules, H1–H3 safety.

---

## 8. Top 10 risks

1. Journal editor layout (void / clipped placeholder) — user-visible, SPEC §0.1.
2. Theme/accent overload mid-distress — cognitive load.
3. Repeated “not clinically reviewed” notices — noise; consolidating must not imply clinical OK.
4. Pattern/self-concept/habits (H) could drift into diagnosis language — hard guardrail.
5. `app.js` size / nested `draw` — change risk without index (Phase B).
6. Keyword kernel false negatives on oblique risk — known SAFETY open item; do not “fix” with LLM.
7. Gallery + SW cache drift if assets change without CACHE bump.
8. Autofocus / keyboard covering toolbar on journal (Phase D).
9. Contrast on mood themes / gradients after cull (Phase F).
10. Addiction-shaped “engagement” polish (Phase I) — forbidden; keep worth-returning-to only.

---

## 9. Phase order reminder

A (this file) → B code health → C layout/density + theme cull + journal flex → D keyboard →
E design system → F theme parity → G a11y → H1/H2/H3 depth → I honest visual → J QA.

**Phase A complete. No product code changed.**
