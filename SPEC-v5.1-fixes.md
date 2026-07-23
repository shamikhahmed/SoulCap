# SPEC v5.1 — Breathing visibility, Settings controls, FAB overlap (build guide for Cursor)

> Defect-fix pass on v5.0.7. All four issues below were **measured on the running app**, not
> guessed. Same rules as always (`AGENTS.md`). Run the loop protocol from
> `SPEC-v5.0-native-motion.md §9` (implement → verify → bump → docs → gallery → commit → push).

---

## 1. Breathing orb + countdown are nearly invisible — **the priority fix**

**Measured (Runner and Panic, dark theme):**
| Element | Value | Problem |
|---|---|---|
| Countdown colour | `#8B7CF0` on `#14121A` → **5.52:1** (Runner) / **5.73:1** (Panic) | Accent-on-dark. Passes AA-large but far too faint for the one thing you stare at while breathing. |
| Orb background | `rgba(0,0,0,0)` | **Fully transparent** — no body, just a thin ring. |
| Orb ring opacity | **0.12** | Effectively invisible. |

**This is very likely also why the exercise "feels too fast"** — see §2. If you cannot see the
circle or the number, you cannot follow the rhythm, so it reads as racing past you.

**Fix:**
- **Countdown number → `--ink`** (≈16:1), not accent. Keep the accent for the ring/glow only.
  Increase weight slightly; keep 44px (Runner) / 56px (Panic) or larger.
- **Give the orb a body:** fill with a soft accent-tinted gradient (e.g. `--accent-soft` → transparent
  radial), not `transparent`. It must read as an object, not an outline.
- **Ring opacity 0.12 → ~0.45–0.6**, stroke ≥2px, and make the *active* ring clearly brighter than
  the trailing ring.
- Ensure this holds in **all themes** (light/dark/night/AMOLED/Ocean…) and in the **CSS fallback orb**
  (no-WebGL / Still preset), not just the shader path.
- Panic keeps its plain layout — this is contrast only, no new motion.

**Test to add:** countdown text contrast ≥ 7:1 against its backdrop in every theme, in Runner and
Panic; orb fill is not fully transparent.

---

## 2. "The techniques go too fast"

**Measured — the timing is actually correct:**
- Step technique (`thought-record`): **9s per step**, countdown visible (8→9), advances on schedule.
- Paced breathing (`box-breathing`): **4s phases**, "Breath 2 of 8 · 1:44 min left" — correct.
- Panic pacer: 4s phases — correct.

So the engine is not broken. Two things to do anyway:
1. **Fix §1 first** and re-judge. Invisible pacing cues are the most likely cause of the "too fast"
   feeling.
2. **Make the rhythm legible regardless:**
   - The phase label (`Breathe in through your nose` / `Hold` / `Breathe out…`) should be the largest,
     highest-contrast thing on screen, changing with a clear but calm transition.
   - Add a **visible progress arc** around the orb that depletes over the phase — a spatial cue, not
     just a number.
   - Consider defaulting **exercise pace to Slow** for first-time users (setting already exists:
     Slow / Steady / Brisk) and surface that control **inside the runner**, not only in Settings.
   - Confirm GSAP/View-Transition work has not shortened any transition below its token duration.

**Test to add:** phase durations match the pattern spec ±150ms for box-breathing and 4-7-8; step
duration ≥9s at Steady pace.

---

## 3. Settings sheet — two competing control languages

**Measured:** the sheet contains **38 pill chips (radius 999px)** *and* **12 full-width rectangles
(`btn ghost`, radius 16px, 341px wide)**, interleaved. That is the "tiles are oval but the button is
a rectangle" the owner reported.

Worse, the toggles are **fake**: state is concatenated into the label —
`"Higher contrastOff"`, `"VibrationOn"`, `"Hide short path on NowOn"`, `"Spoken guidanceOff"`.
There is no switch, no visual on/off, and the buttons are transparent (`rgba(0,0,0,0)`), so they read
as inert text rather than controls. That is the "selection looks wrong / hard to select".

**Fix — one control language per job:**
- **Exclusive choice** (theme, accent, language, motion preset, pace, map pace) → a **segmented
  control** or a chip group, but *pick one and use it everywhere*. Recommend: **chips for ≤4 options,
  a proper segmented control for the rest.** The 11-option theme group must not be a dense wrap —
  give it a 2-column grid of labelled swatch tiles, each ≥48px with a clear selected ring.
- **Binary setting** (higher contrast, reduce transparency, spoken guidance, vibration, show links,
  track last spoken, hide short path) → a **`toggle-row`**: label left, one-line explanation beneath,
  **real switch on the right**. Never concatenate the state into the label.
- **Action** (Export everything, Delete everything, About, Close) → a **`list-row`** with a chevron,
  or a proper button for destructive actions — visually distinct from settings, grouped at the end.
- Give every row a visible surface (not transparent), ≥48px, generous spacing, and a clear
  pressed/selected state. Group under section labels with breathing room.

**Test to add:** no Settings group mixes pill-radius and rect-radius controls; every binary setting
exposes `role="switch"` with `aria-checked`; every control ≥48px.

---

## 4. Help FAB still overlaps content (third time specced)

**Measured:** hit-test shows `#fab` overlapping the "A short path" tile on **Now** and the Patterns
tile on **You**. Specced in v3.0 §1f and v4.0 — still shipping.

**Fix:** the FAB must never cover a card/tile. Either reserve bottom padding on scroll containers
equal to FAB height + safe-area + tab bar, or move Help into the screen header on Now/You. It must
stay reachable in one tap on every tab.

**Test to add (regression lock):** on every tab, `#fab` bounding box intersects **zero**
`.card`/`.tile`/`.hero-tile`/`.stat-tile`/`.list-row`.

---

## 5. Version drift

`package.json` is **4.0.1** while `VERSION.json`, `APP_VERSION` and `sw.js` are 5.0.7 / `soulcap-v507`.
Bump `package.json` and add it to the ship-workflow bump list in `AGENTS.md` and `.cursorrules`.

---

## 6. Minor polish
- Hero-band → first section gap is 72px on You, 64px on Now; under a short hero this reads as dead
  space. Tighten to 48px.

---

## 7. Order
1. **PR-1 §1** breathing/countdown visibility (highest user impact, safety-adjacent on Panic).
2. **PR-2 §2** rhythm legibility + pace default/in-runner control + timing tests.
3. **PR-3 §3** Settings control system rebuild.
4. **PR-4 §4 + §5 + §6** FAB regression lock, version bump, spacing.

Guardrails unchanged: offline/vendored only, no diagnosis, tier-3 Help, red-flag + not-reviewed
banners, Panic stays the plainest surface and gesture-free.
