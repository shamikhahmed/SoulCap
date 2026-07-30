# SPEC v8 — Information architecture, organization & documented screen gallery

> After V7 (Quiet Depth) the app looks flagship and the journal void is fixed. The remaining weak area
> is **organization / IA** — how things are grouped, ordered, selected, and found — plus **empty-state
> impression**, **a11y depth**, and a **shallow screen gallery**. This spec fixes all of it to the
> standard of Apple / Linear / Notion settings and navigation.
>
> Read `AGENTS.md`, `SPEC-v6.0-production.md`, `ROADMAP-v6-flagship.md`, `SPEC-v7-redesign.md`,
> `SAFETY.md` first. All guardrails hold. Run as a loop; each item: build → VERIFY LIVE (measure /
> screenshot, never trust green) → bump 4 version fields → doc → gallery → commit → push → next.
> STOP only when W1–W8 are all done and proven live.

Current: v7.0.13. Measured live this session (the evidence behind this spec):
- "You" tab does three jobs (progress + tools + about/settings), is a long scroll, and shows
  **"Set up profile" TWICE** (a top button and an "About you" row).
- Depth tools (Two versions of you, Habit support, Reflection check) sit two levels deep under
  You → Your tools — core features with low discoverability.
- Settings groups **Language inside Appearance** (between theme and accent); no conventional grouping,
  no search.
- Most data surfaces show "not enough yet" — the cold-open impression is emptiness.

---

## W1 — "You" tab IA overhaul (split the catch-all)
Reorganize so each thing has one home and one purpose. Target structure (adapt names to the voice):
- **You** stays a calm identity/overview surface: greeting, profile, story — and a compact PROGRESS
  glance (This week) with a single "See more" into a dedicated progress view. NOT the whole dashboard
  inline.
- **Tools** (Two versions of you, Habit support, My plan, Reflection check, Principles, My manual)
  get a clear, discoverable home — either a labelled "Tools" section high on You, or promoted so a
  first-timer finds them. Decide based on the personas; justify the choice in one line.
- Remove the **duplicate "Set up profile"** — one entry only.
- **Settings** must be a first-class, obvious entry (a gear in the You header or a top row), NOT the
  last row after a long scroll.
- Every row: label + one-line purpose + chevron; consistent tap target ≥48px; real button semantics
  (not div-with-onclick).

## W2 — Settings IA to big-company convention (with reasoning)
Regroup Settings the way mature apps do, and write the reasoning into `IA-RATIONALE.md`. Convention:
most-used / identity near the top, destructive / legal near the bottom.
- **Appearance** — theme, accent, ambient (Ocean/Forest). (Theme first: most-changed.)
- **Language** — its OWN group, not nested under Appearance.
- **Accessibility** — text size, contrast, transparency, motion (Vivid/Balanced/Still), reduced-motion.
- **Personalisation** — pattern observations toggle, "hide short path on Now", guided-technique
  options, constellation pace.
- **Privacy & Data** — "everything stays on this device", export, delete-all (destructive, near
  bottom, with confirm).
- **About & Legal** — version, the one honest not-medical line, credits, licenses. (Bottom.)
Order within each group: toggles/selects the user changes most at top; rarely-touched at bottom.
Add a Settings **search/filter** if the list grows past ~2 screens.

## W3 — Tab-by-tab organization audit
For **Now, Calm, Journal, People, You** write, in `IA-RATIONALE.md`, what each tab is FOR, what sits
above the fold and why, what is primary vs secondary, and what was moved/cut. One idea per screen;
3–4 distinct things above the fold; no surface duplicating another. Fix anything that fails this.

## W4 — Empty-state / cold-open strategy (honest, not fake)
A reviewer opening cold must understand the value without "not enough yet" everywhere. Options (pick,
justify, keep guardrails — NO fake data presented as the user's):
- A clearly-labelled **"Preview" / "Example"** state that shows what a populated surface will look
  like, explicitly marked as an example, never mistakable for real data.
- Or a gentle first-run that seeds one real check-in / example so surfaces aren't barren.
Never invent streaks, scores, or history and present them as the user's own.

## W5 — Accessibility depth (real-AT grade)
- The "This week" heatmap must expose ONE meaningful summary label to screen readers, not seven raw
  date strings. Fix the aria structure.
- Every div-with-onclick becomes a real `button`/`role` with label + focus-visible + ≥48px target.
- Re-verify VoiceOver order on You, Settings, Journal editor, Runner, Screener, Panic; Dynamic Type
  200% no clip. Add/repair tests that fail on the broken state.

## W6 — Expanded, DOCUMENTED screen gallery
Make the gallery a real design document, not just screenshots. For every key screen AND its important
states, capture the screenshot PLUS a short caption covering:
- **What it is / what it's for.**
- **How things are selected** (tap ruled row / segmented / toggle) and **how state is kept** (local
  key, when it persists).
- **Why** it's organised this way (link to `IA-RATIONALE.md`).
States to include, not just the default: empty, one-item, many-items, error/again, loading, selected,
keyboard-open (journal), each of the 7 themes for one representative screen, light + dark, reduced-
motion. Output an indexed `screen-gallery.html` grouped by tab, plus the `assets/gallery` mirror.

## W7 — Clinical-safety honesty pass (the real risk)
Re-audit every surface that shows pattern/estimate/screener text. Confirm: non-diagnostic wording,
user-correctable, item-9 → Help, tier-3 free text → Help, no severity verdicts, About/Legal not-medical
line intact. Document in SAFETY.md that pattern + screener copy is still **not clinician-reviewed** and
keep that blocker visible. Do NOT claim clinical review.

## W8 — Docs + versioning + final live proof
Update CHANGELOG, HANDOVER, README, and the new `IA-RATIONALE.md`. Bump package.json / VERSION.json /
docs/sw.js CACHE / APP_VERSION together. Regenerate the documented gallery. Then print a report with
LIVE evidence (screenshots + measurements) proving: no duplicate profile entry, Settings regrouped,
depth tools discoverable, heatmap SR label fixed, cold-open no longer barren. STOP.

## Guardrails (unchanged)
Offline/vendored only, no network, ES5, `el()`. Safety kernel + number-free Help + 18+ gate intact.
No crisis numbers. Worth-returning-to, NOT addictive. About/Legal keeps the one honest not-medical
line. Nothing marked clinically reviewed. Verify LIVE, never trust a green test alone.

---

### Not code (state honestly, do not "fix" in Cursor)
- Licensed clinician sign-off on techniques / screeners / pattern / path copy.
- Real-device testing (iPhone/Android): keyboard, safe-area, PWA install+update, WebGL orb perf.
- Roman Urdu clinical-copy review before that locale ships.
These gate any "clinician-approved" or "App-Store-ready" claim regardless of how clean the code is.
