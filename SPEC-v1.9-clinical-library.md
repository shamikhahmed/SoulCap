# SPEC v1.9 — Clinical content library (build guide for Cursor)

> **This is an execution spec, not a suggestion.** Build it exactly as written, in the order given,
> in the app's existing conventions (`AGENTS.md`). Work at highest effort: real clinical copy, real
> tests, no stubs. Every PR must leave the app green (`npm run verify`) and the cache bumped.
> When a decision isn't covered here, choose the safest, calmest, most honest option and note it.

**Owner decisions locked (2026-07-23):**
- Screening = **validated PHQ-9 + GAD-7, reflection-framed** (never diagnosis).
- First build scope = **physical/somatic + cognitive experiences** (emotional/behavioural/sleep/
  social come in a later pass).
- Red-flags = **both** distinct emergency panels **and** softer general "get this checked" wording.
- Also **stabilise the 2 flaky tests** (see §8).

Full clinical background + the complete ~60-experience list lives in the owner's vault:
`~/Capricorn-Brain/AI/Claude-Code/SoulCap-Clinical-Content.md`. This spec is self-contained for v1.9.

---

## 0. The one rule that overrides everything

**We screen and reflect. We never diagnose.** Language is always *"you might be experiencing…",
"many people describe…", "this could be worth talking to someone about."* Never "you have X."
Every screener and every experience carries a visible "not a diagnosis / not clinically reviewed
yet" line. **Red-flag routing is mandatory** — some "anxiety symptoms" are medical emergencies and
must be sent to real care, not calmed. Getting §5 wrong is the only truly dangerous failure here.

Inherits all hard rules in `AGENTS.md §2` (offline, no network, no numbers, ES5, tokens, tests).

---

## 1. Data model — add to `docs/data.js` (content only, ES5 `var`)

### 1a. `EXPERIENCES`
```js
var EXPERIENCES = [{
  id: 'racing-heart',
  name: 'Racing heart or palpitations',
  group: 'physical',            // 'physical' | 'cognitive' (v1); later: emotional|behavioural|sleep|social
  aka: ['heart pounding','chest fluttering','skipping beats'],
  whatItis: 'Your heart feels like it is pounding, racing, or skipping. It is one of the most common and most frightening feelings of anxiety.',
  why: 'When your brain senses threat it releases adrenaline, which speeds the heart to ready you to act. There is nothing wrong with the heart itself — it is doing its job, just when no running or fighting is needed.',
  commonWith: ['anxiety','panic'],   // clustering, NOT a diagnosis
  helps: ['physiological-sigh','cold-water','box-breathing'],  // ids that MUST exist in SKILLS
  selfCare: ['Let the wave crest — it peaks and falls within minutes, it cannot harm a healthy heart.',
             'Slow the exhale; a long out-breath is the brake.','Feel your feet on the floor.'],
  reflection: ['What was happening just before it started?'],
  redFlag: { level: 'emergency', text: 'Crushing chest pain, pain spreading to your arm or jaw, or breathlessness while resting is different from anxiety — treat it as a possible heart problem and contact emergency services or a doctor now.' },
  source: 'Autonomic arousal — standard anxiety psychoeducation'
}];
```
Rules: every `helps` id must exist in `SKILLS`. `redFlag` is `null` or `{ level:'emergency'|'seeDoctor', text }`.
`group` limited to `physical`/`cognitive` in v1. Keep `whatItis` validating, `why` honest and
mechanism-first, copy plain and warm (see `AGENTS.md §4` voice).

### 1b. `EXPERIENCE_GROUPS` (labels/order/blurbs) and `LIBRARY_UI` additions for search/empty states.

### 1c. Screeners `SCREENERS` (PHQ-9, GAD-7) — see §4 for exact items/bands.

### 1d. `REDFLAG_UI` — copy for the two panel variants (§5).

Any new user-visible string also goes in `STRINGS`/`*_UI` and gets a Roman Urdu (`rui`) chrome
entry where the rest of the app is localised; **clinical bodies stay English until review** (match
existing `rui` policy).

---

## 2. The v1 experience list (write full entries for all of these)

Each gets the full §1a shape. Core content is given so the copy is grounded — expand into the
validating/plain voice, keep `why` mechanism-first, attach real `helps` ids from `SKILLS`, and set
`redFlag` exactly as noted. Do not invent techniques; if a good `helps` match doesn't exist, use the
closest existing skill and note the gap in the PR.

### Physical / somatic
| id | name | why (core) | helps (existing skill ids) | redFlag |
|---|---|---|---|---|
| racing-heart | Racing heart / palpitations | adrenaline speeds heart | physiological-sigh, cold-water, box-breathing | **emergency**: crushing/radiating chest pain, breathless at rest |
| short-breath | Can't get a full breath | over-breathing, not lack of air | box-breathing, four-seven-eight, grounding-54321 | **emergency**: sudden severe breathlessness, blue lips, chest pain |
| chest-tight | Chest tightness / pressure | muscle bracing + shallow breath | pmr, physiological-sigh | **emergency**: pain to arm/jaw, sweating, breathless → cardiac |
| dizzy | Dizziness / lightheaded | low CO₂ from fast breathing | box-breathing, feet-floor | **seeDoctor**: fainting, room spinning, one-sided weakness |
| trembling | Trembling / shaking | adrenaline in muscles | burst-movement, physiological-sigh | null |
| nausea-gut | Nausea / butterflies / gut clench | gut-brain axis | grounding-54321, cold-sip | **seeDoctor**: severe/persistent pain, blood |
| facial-tension | Jaw/face tension, tingling, numb lips | bracing + over-breathing tingling | pmr, box-breathing | **emergency**: sudden one-sided facial droop, slurred speech, arm weakness → possible stroke/Bell's palsy, urgent care now |
| muscle-tension | Neck/shoulder/back tension | sustained bracing | pmr, ten-minute-walk | null |
| headache | Tension headache / band | scalp+neck bracing | pmr, wind-down | **seeDoctor**: sudden 'worst ever' headache, with fever/confusion → emergency |
| fatigue | Exhaustion / heavy limbs | chronic arousal + low mood | behavioural-activation, wind-down | **seeDoctor**: sudden severe weakness |
| sweating-flush | Sweating / hot-cold flushes / dry mouth | autonomic surge | cold-water, grounding-54321 | null |
| clenching | Teeth grinding / clenching | stress bracing | pmr, wind-down | null |
| appetite | Appetite change (loss / comfort eating) | stress + mood | self-compassion-break, wind-down | **seeDoctor**: rapid weight loss |
| restless | Restlessness / can't sit still | circulating adrenaline | burst-movement, feet-floor | null |

### Cognitive
| id | name | why (core) | helps | redFlag |
|---|---|---|---|---|
| racing-thoughts | Racing thoughts | threat-scanning mind | count-backwards, categories, worry-postponement | null |
| rumination | Rumination (chewing the past) | stuck loop | defusion, worry-vs-problem, behavioural-activation | null |
| overthinking | Overthinking / paralysis | analysis loop | thought-record, behavioural-activation | null |
| catastrophising | 'What if the worst…' | threat overestimation | thought-record, worry-postponement | null |
| intrusive | Intrusive thoughts | brain misfiling, not intent | defusion, container, self-compassion-break | null (reassure: distressing, not dangerous) |
| brain-fog | Can't concentrate / fog | arousal steals working memory | grounding-54321, feet-floor | **seeDoctor**: sudden confusion/disorientation → emergency |
| indecision | Indecision | overload | values-check | null |
| self-criticism | Harsh self-talk | learned inner critic | self-compassion-break, thought-record | null |
| time-blur | 'The day is a blur' | dissociative fog | grounding-54321, orient-room | null |
| hypervigilance | On edge / startle / scanning | threat system stuck on | orient-room, box-breathing | null |

> Verify each `helps` id against `SKILLS` in `docs/data.js` before writing. If the exact ids differ,
> use the real ones. Adjust names to match the app's technique names.

---

## 3. UI — where it lives

1. **Library expansion.** Add an **Experiences** section to the existing Library (the ARTICLES
   surface in Calm). Searchable by name + `aka`. Each experience opens a calm detail sheet:
   *what it is → why (mechanism) → what helps (tappable skill cards → runner) → self-care →
   one reflection → redFlag panel if present → source + not-reviewed line.*
2. **"What's happening?" entry point.** On the **Now** check-in flow (and/or Calm), add an optional
   *"Notice what's happening in your body or mind"* → a picker of the experiences (grouped) → the
   matched experience detail. One tap from a symptom to something that helps. Never forced.
3. **Fight-or-flight** + **Boundaries / wind-down** as long-form Library **articles** (existing
   `ARTICLES` model): see §6.
4. **Screeners** live as an opt-in **"Reflection check"** in You (and/or delivered via the existing
   drip). See §4.

Reuse existing components: `el()` builder, `openSheet`, skill card renderer, Library search, token
styles. No new colours unless you add a token in all theme blocks.

---

## 4. Screeners (PHQ-9, GAD-7) — reflection, never diagnosis

Public-domain instruments. Opt-in only. Delivered either as a short one-sitting check or via the
existing drip (a few items at a time). Response scale for every item: **0 Not at all · 1 Several
days · 2 More than half the days · 3 Nearly every day** ("Over the last 2 weeks, how often…").

**PHQ-9 items (mood):** 1 little interest/pleasure · 2 down/depressed/hopeless · 3 sleep trouble or
oversleeping · 4 tired / low energy · 5 poor appetite or overeating · 6 feeling bad about
yourself / a failure · 7 trouble concentrating · 8 moving/speaking slowly, or restless/fidgety ·
9 **thoughts you'd be better off dead or of hurting yourself**. Total 0–27. Bands: 0–4 minimal ·
5–9 mild · 10–14 moderate · 15–19 moderately severe · 20–27 severe.

**GAD-7 items (anxiety):** 1 nervous/anxious/on edge · 2 can't stop/control worrying · 3 worrying
too much · 4 trouble relaxing · 5 restless, hard to sit still · 6 easily annoyed/irritable ·
7 afraid something awful might happen. Total 0–21. Bands: 0–4 minimal · 5–9 mild · 10–14 moderate ·
15–21 severe.

**Output (fixed framing):** show the band + a gentle line, e.g. *"Your answers over the last two
weeks are in a range some people describe as **moderate**. This is not a diagnosis — only a
professional can give one — but a level around here often means it's worth talking to someone you
trust or a professional. Here are some things that may help in the meantime."* Then link relevant
experiences/skills.

**Safety routing (mandatory):**
- **PHQ-9 item 9 > 0** (any endorsement of self-harm/better-off-dead) → immediately surface the
  existing hard-coded tier-3 **Help** surface, regardless of total score.
- Score in the top band → gentle, explicit nudge toward professional support.

**Storage:** store as a **low-confidence signal** in the user model (trust tiers), viewable and
correctable in **"What SoulCap knows"**, and trackable over time as a plain line (no score-chasing,
no streak, no badge). Never store as a label like "depressed".

---

## 5. Red-flag routing (both variants — mandatory)

Two panel types, both country-agnostic and number-free (per owner):

1. **`emergency`** — calm but unambiguous: *"This is different from anxiety. [symptom] can be a
   sign of something urgent. Please stop and contact your local emergency services or a doctor
   now."* Distinct, high-visibility styling (reuse the crisis-panel treatment; a "see a doctor"
   colour is fine as a token).
2. **`seeDoctor`** — softer: *"If this is new, severe, or mainly physical, please get it checked by
   a doctor. Anxiety is diagnosed only after physical causes are ruled out."*

Apply per-experience via the `redFlag.level`. Also show a **general** `seeDoctor`-style line once at
the top of the Experiences library ("This helps you understand and cope — it does not replace a
medical check-up"). The existing tier-3 keyword Help still fires on any free-text self-harm content.

**This is the honest counterweight to "the app helps with everything." The app must know its edges,
loudly.**

---

## 6. Two long-form articles (existing `ARTICLES` model)

- **"Your body's alarm — fight, flight, freeze."** What the threat response is; why it's protective
  not broken; why it produces the physical symptoms in §2; freeze/fawn too; the recovery side
  (parasympathetic, the exhale as the lever, co-regulation); ends by linking breathing/grounding.
- **"Slowing down — boundaries & winding down."** The therapist's "no work after 7pm": a protected
  wind-down window (user-set, opt-in, no guilt if missed), why chronic arousal needs a daily
  off-ramp (light/screens/work bleed), a "close the day" ritual, micro-breaks, single-tasking,
  morning light + sleep pressure basics. Links to daily supports + the journal night-reflection
  template. *(A user-set wind-down time may be added to state — optional, no notifications since the
  app has none; just a gentle in-app reminder card on Now after that hour.)*

Both end with the "when to seek professional support" section and the not-reviewed line.

---

## 7. Tests (required — safety-critical behaviour gates the deploy)

Add to `e2e/` (mobile + desktop). At minimum:
- Every `EXPERIENCES[].helps` id exists in `SKILLS` (data-integrity test).
- Opening an experience shows what/why/helps; a `helps` card launches the runner.
- An experience with `redFlag.level==='emergency'` renders the emergency panel; text contains no
  phone number (`/\b\d{3,}\b/` must not match) and no country name.
- PHQ-9/GAD-7: completing with item-9 (PHQ) endorsed routes to the Help surface; a top-band total
  shows the professional-support nudge; result is stored as a correctable signal, not a label.
- Screener output copy contains "not a diagnosis".
- Library search finds an experience by an `aka` term.

---

## 8. Stabilise the 2 flaky tests

Both fail only under parallel load because they measure **during** CSS animation:
- `e2e/app.spec.ts` → *"both themes keep body text readable"* — reads `getComputedStyle` colour
  mid theme-transition. Fix: before measuring, wait for transitions to finish (e.g. set the theme,
  then `await page.waitForFunction` that no element is mid-transition, or disable transitions for
  the assertion via `prefers-reduced-motion` emulation: `test.use({ reducedMotion: 'reduce' })` on
  that block, or `page.emulateMedia({ reducedMotion:'reduce' })`).
- `e2e/personas.spec.ts:104` → *"motion-sensitive keyboard user…"* — measures journal-editor
  control size while the editor's open animation runs. Fix: `await expect(editor).not.toHaveClass
  (/animating/)` or wait for `animationDuration`/transition end, or run that spec with
  `reducedMotion:'reduce'` so sizes are stable.
Prefer `page.emulateMedia({ reducedMotion: 'reduce' })` in these specs — it also better matches the
users they describe. Goal: `npm run verify` reliably green across repeated runs.

---

## 9. Sequencing (each PR independently shippable & green)

1. **PR-1 flaky-test fix** (§8) — smallest, unblocks reliable CI. Bump nothing but tests.
2. **PR-2 data + library** — `EXPERIENCES` (physical group first, then cognitive), Library
   Experiences section + search + detail sheet + red-flag panels (§1,2,3,5,7). Bump cache/version.
3. **PR-3 entry points** — "what's happening?" picker from Now/Calm → experience → skill (§3.2).
4. **PR-4 articles** — fight-or-flight + boundaries/wind-down (§6).
5. **PR-5 screeners** — PHQ-9 + GAD-7 reflection check, routing, storage, tests (§4).

After each PR: update `CHANGELOG.md`, bump `sw.js` CACHE + `VERSION.json` + `APP_VERSION`, bump
`SAFETY.md`/`HANDOVER.md` version, `npm run verify`, push. Confirm live `sw.js` shows the new cache.

---

## 10. Guardrails checklist (every PR)
- [ ] No network calls, no new deps, ES5, tokens, `el()` builder.
- [ ] No "you have X" language anywhere; screeners say "not a diagnosis".
- [ ] Every emergency/red-flag path present and country-agnostic (no numbers).
- [ ] PHQ item-9 and free-text self-harm both route to the existing tier-3 Help.
- [ ] "Not clinically reviewed" banner still shown; nothing marked reviewed.
- [ ] New strings localised in chrome; clinical bodies stay English (matches `rui` policy).
- [ ] Tests added for the safety-critical paths; `npm run verify` reliably green; cache bumped.
