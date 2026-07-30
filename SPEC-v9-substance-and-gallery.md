# SPEC v9 — Prove the substance + expand the documented gallery

> v8.0.2 made the app crafted and organized (IA, visuals, perf, offline — verified live). What is NOT
> proven is whether the DEPTH ENGINES produce meaningful, correct output under real longitudinal use,
> and whether the content is genuinely good. This spec closes those, and turns the screen gallery into
> a real design document (selection · keep · why, populated states, settings-order reasoning).
>
> Read AGENTS.md, SPEC-v6/v7/v8, SAFETY.md, IA-RATIONALE.md first. Guardrails hold. Loop: build →
> VERIFY LIVE (measure/screenshot with SEEDED data, never trust green) → bump 4 version fields → doc →
> gallery → commit → push → next. STOP only when X1–X7 done and proven live.

Current: v8.0.2 (soulcap-v802). Verified live this session: no duplicate profile, Tools promoted,
Settings first-class + search + Language its own group, honest "EXAMPLE WEEK — not your data", 0
external hosts. Least-confident areas below are what remains.

---

## X1 — Prove the depth engines with SEEDED longitudinal data (not empty, not example)
Add a dev-only seeding harness (e.g. `?seed=weeks`) that loads weeks of realistic LOCAL check-ins,
journal entries, and constellation notes — clearly dev-only, never shipped to real users.
- Self-concept ("Two versions of you"): run the full flow; confirm it produces reflective, specific,
  NON-generic output that changes with input — not the same paragraph regardless of answers.
- Pattern engine: with seeded data, confirm the surfaced observations are (a) actually derived from
  the data, (b) correct, (c) confidence-labelled, (d) one-tap correctable, (e) never diagnostic, (f)
  never leave the device. Deliberately seed a pattern and prove it's detected; seed noise and prove it
  does NOT over-claim.
- Habits (cue→routine→reward + urge-surfing): complete a real loop; confirm it's supportive, no
  streak/shame, and the logged data persists and reads back correctly.
- Record each with live screenshots + the seeded input in ENGINE-PROOF.md.

## X2 — Longitudinal data & calculation correctness (Appendix G, on populated data)
With the seed harness, verify every number on You/progress/patterns/weekly:
- Compute expected values independently; compare to UI. Streak-free counts, "this week", per-day
  heatmap, and any summary must match the seeded source exactly.
- Correct date-range boundaries (no off-by-one), timezone handling, week start, empty/zero/one/many,
  and huge-history cases. No NaN/undefined/"-"/stale-after-change.
- Add tests asserting exact computed values on a fixed seed (fail on a deliberately wrong calc, pass
  after). Verify LIVE on the populated dashboard.

## X3 — Content quality pass (library warmth + accuracy)
Audit all 37 techniques + experiences + article/path copy for: clarity, warmth, correct instruction,
consistent voice, no broken/duplicate/placeholder copy, contraindications present where needed. Fix
thin or off-tone entries. Keep non-diagnostic framing. This is a read-every-line pass, logged in
CONTENT-AUDIT.md.

## X4 — Expanded, DOCUMENTED screen gallery (the one the owner wants)
Rebuild the gallery as a real design document. For EVERY key screen AND state (empty · example ·
SEEDED-populated · one · many · error · loading · selected · keyboard-open · each of the 7 themes ·
light+dark · reduced-motion), capture the screenshot PLUS a caption covering:
- What it is / what it's for.
- HOW things are selected (ruled row tap / segmented / toggle / chip) — name the control.
- HOW state is kept (which localStorage key, when it persists, schema version).
- WHY organised this way — link to IA-RATIONALE.md.
Group by tab, indexed `screen-gallery.html` + `assets/gallery` mirror. Include a SETTINGS-ORDER
section that explains, big-company style, why each group sits where it does (Appearance/Language/
Accessibility/Personalisation near top; Privacy & Data; About & Legal at the bottom) — the reasoning,
not just the layout.

## X5 — Tab-by-tab organization, re-confirmed live with reasoning
In IA-RATIONALE.md, for Now/Calm/Journal/People/You/Settings: what it's FOR, what's above the fold and
why, primary vs secondary, what was moved/cut and the reason. Confirm each live against the running app
(screenshot evidence). Fix any remaining "one idea per screen" violation.

## X6 — Maintainability (app.js single-file risk)
app.js is ~5k lines in one IIFE. Without changing behaviour, make it safely navigable: clear section
banners, a top function index, and (if the no-build constraint allows) split into logically-loaded
files that index.html includes in order. Goal: a future safe edit near the safety kernel is easy to
locate and hard to break. Prove offline + all tests still pass live after.

## X7 — Docs, versioning, final live proof
Update CHANGELOG/HANDOVER/README/IA-RATIONALE + new ENGINE-PROOF.md/CONTENT-AUDIT.md. Bump
package.json/VERSION.json/docs/sw.js CACHE/APP_VERSION together. Regenerate the expanded gallery.
Print a report with LIVE evidence (seeded screenshots + measured numbers) proving the engines produce
real, correct output and the gallery documents selection/keep/why. STOP.

## Guardrails (unchanged)
Offline/vendored, no network, ES5, `el()`. Safety kernel + number-free Help + 18+ gate intact. No
crisis numbers. Worth-returning-to, NOT addictive. About/Legal keeps the one honest not-medical line.
Seed harness is DEV-ONLY and never ships as the user's real data. Nothing marked clinically reviewed.
Verify LIVE with seeded data, never trust a green test alone.

---

### Not code — the real ceiling (state honestly; cannot be fixed in Cursor)
1. Licensed clinician sign-off on techniques/screeners/pattern/path copy. Until then it is not proven
   effective or clinically safe — the biggest open risk.
2. Real-device testing (physical iPhone + mid Android): PWA install/update, keyboard, safe-area, WebGL
   orb perf + battery.
3. Roman Urdu clinical-copy review before that locale ships.
These gate "effective", "clinician-approved", and "App-Store-ready" no matter how clean the code is.
