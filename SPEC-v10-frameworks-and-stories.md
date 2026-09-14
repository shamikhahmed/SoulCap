# SPEC v10 — Therapist-informed frameworks + relatable stories (folded into existing tabs)

> New clinical depth the owner learned from a therapist, web-verified 2026-09-14. Adds several
> evidence-based reflective frameworks + a lived-experience story library, folded into the existing
> tabs (NO new tab). Everything stays offline, local-only, ES5, `el()`, non-diagnostic, safety-kernel
> on free text, and honestly "not clinician-reviewed" until sign-off.
>
> Read AGENTS.md, SPEC-v6/v7/v8/v9, SAFETY.md, IA-RATIONALE.md first. Loop: build → VERIFY LIVE (seed
> data, measure/screenshot, never trust green) → bump 4 version fields → doc → gallery → commit →
> push → next. STOP only when Y1–Y9 done and proven live.

Current base: v8.0.2. Build AFTER (or alongside) SPEC-v9 substance work.

## Evidence tiers (label each in-app + in copy)
- **A (strong):** affect labeling / emotion differentiation; cognitive restructuring + thought records;
  graded exposure (the mechanism behind the zones).
- **B (evidence-informed / trauma-informed):** Window of Tolerance (Siegel/Porges); EMDR belief
  reframe (the NC/PC construct — strong within EMDR, but we are NOT doing EMDR).
- **C (framework/coaching):** Learning-Zone model (Senninger/Vygotsky) as psychoeducation.
Show the honest framing; never overclaim.

---

## Y1 — Emotion wheel (Tier A) → folds into Now check-in + Journal
- Upgrade the arrival check-in: after the 5 coarse chips (Steady/Wired/Flat/Heavy/Not sure), an
  OPTIONAL "name it more precisely" drill-down using a calm wheel/list (Plutchik primaries → nuanced
  outer ring, or the Willcox core→leaf structure). Tap a core feeling → refine to a specific word.
- The chosen word tags the check-in and can tag a Journal entry. Stored locally with the entry.
- Copy teaches, briefly: "Naming a feeling more precisely can take some of its heat out." (affect
  labeling). Never required — coarse chip alone is always enough.
- Non-diagnostic; it's vocabulary, not assessment.

## Y2 — Belief reframe / NC→PC (Tier B) → You › Tools (reframe cluster)
- A gentle exercise: notice a harsh self-belief ("negative cognition") → the 4 families as prompts
  (Safety, Worth/Value, Responsibility, Control/Power) → draft a kinder, believable alternative
  ("positive cognition") → rate "how true does the kinder one FEEL right now?" on a 1–7 slider (the
  VoC idea), revisit later.
- **HARD SAFETY:** never call this EMDR, never simulate eye movements / bilateral stimulation / memory
  reprocessing. It is a reflective CBT-style belief reframe only. If free text hits tier-3 → Help.
- Pairs with the SPEC-v9 thought record and self-concept tool.

## Y3 — Cognitive distortions + cognitive triangle (Tier A) → You › Tools
- A short, plain-language library of common distortions (all-or-nothing, catastrophizing, mind-reading,
  overgeneralization, mental filter, should-statements, personalization…), each with a one-line "what
  it sounds like" + a gentle counter-question.
- A simple **cognitive triangle** visual (thoughts ↔ feelings ↔ behaviours) as the connective
  psychoeducation that ties wheel, reframe, and thought record together.
- Let a user tag a thought (in the reframe/thought-record) with a distortion — optional, never a verdict.

## Y4 — Comfort / Stretch / Panic zones (Tier C) → calibration in Calm + habits + short path
- A psychoeducation card explaining the three zones (comfort = safe/no growth, stretch = growth,
  panic = overwhelm/learning stops), framed with the graded-exposure mechanism.
- A calibration control the user can attach to a habit step, an exposure, or a "short path" suggestion:
  "does this feel like comfort, stretch, or panic?" → if panic, offer a smaller step; if comfort,
  gently offer a slightly bigger one. Their rating, never the app's judgement.
- No pressure to leave comfort; explicit "comfort is allowed" copy.

## Y5 — Window of Tolerance (Tier B) → pairs with breath/runner/panic
- Psychoeducation: optimal zone vs hyperarousal (panic/racing) vs hypoarousal (numb/shutdown), plainly.
- A quick self-locate ("where am I right now?") that routes to the RIGHT regulation tool: hyperarousal
  → longer-exhale breath / grounding; hypoarousal → gentle activation / orienting. Reuses existing
  breath + grounding, doesn't reinvent them.
- Trauma-informed tone; never clinical labels as verdicts. Tier-3 free text → Help.

## Y6 — SUDS + values/needs (Tier A/C) → light additions
- Optional **SUDS 0–100** distress dial that can attach to zones/exposure/check-in (their number, for
  their own noticing; feeds the honest progress glance, never a score to beat).
- **Feelings → Needs** (NVC) micro-map for the People/Constellation tab: an emotion can point to an
  unmet need — supportive framing for relationship reflection.

## Y7 — Relatable STORIES library (lived-experience) → folds into Calm / You (contextual)
Evidence: lived-experience stories build hope, reduce isolation (80–91% report improved outlook) —
BUT can re-traumatize if done badly. So HARD rules:
- Stories are **clearly fictional/composite**, never presented as real named people, never as the
  user's own data. A visible "a made-up example, not a real person" label.
- Each story: concrete and specific, NO exaggeration, NO graphic crisis detail, and ALWAYS ends in
  realistic hope/agency (not a miracle cure). No numbers/outcomes implying guaranteed results.
- Surface contextually: on a tool or feeling, offer "someone who felt this tried…" → a short story
  that models using a technique. Dismissible, never forced, never a wall.
- Curated set (start ~8–12) spanning the common entry feelings (anxious/wired, low/flat, lonely,
  self-critical, stuck, grief). Written to the tier-A/B tools above.
- Free text the user writes in response is safety-kernel checked; tier-3 → Help.

## Y8 — "Grounded heuristics", NOT machine learning (honest capability)
The app CANNOT learn from case data (offline, local, no ML, no network — and that's the privacy
promise). What "learning from case studies" means here: the suggestion rules and tool content are
AUTHORED from how these frameworks are used in clinical/case literature, encoded as transparent,
inspectable heuristics with confidence + one-tap correction (the existing pattern-engine contract).
Document this plainly in SAFETY.md so no one mistakes it for adaptive AI.

## Y9 — Docs, gallery, safety, versioning, live proof
- Add each framework + the stories library to the DOCUMENTED gallery (what/how-selected/how-kept/why),
  with evidence tier shown.
- SAFETY.md: add every new framework, its evidence tier, the NOT-EMDR boundary, the stories design
  rules, the grounded-heuristics-not-ML clarification, and keep "not clinician-reviewed" visible.
- Because guided > unguided self-help, keep the human-support nudge honest and present (reach someone
  you trust; the in-therapy companion track) — SoulCap augments, never replaces, a therapist.
- Bump package.json/VERSION.json/docs/sw.js CACHE/APP_VERSION together; regen gallery; print a report
  with live seeded evidence. STOP.

## Guardrails (unchanged + additions)
Offline/vendored, no network, ES5, `el()`. Safety kernel + number-free Help + 18+ gate intact. No
crisis numbers. Worth-returning-to, NOT addictive — no streaks/scores to beat (SUDS/VoC are personal
noticing, not gamified). About/Legal keeps the one honest not-medical line. **Never claim EMDR.**
Stories are labelled fiction. Everything non-diagnostic, user-correctable, local. Verify LIVE.

### Not code — the real ceiling (unchanged, now larger because clinical surface grew)
1. Licensed clinician sign-off — now covers these new frameworks + every story. Bigger and more
   important than before: EMDR-adjacent and trauma content especially needs review.
2. Real-device testing.
3. Roman Urdu clinical-copy review.
