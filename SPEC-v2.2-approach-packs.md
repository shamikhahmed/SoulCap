# SPEC v2.2 — Approach packs, distortion lens, thought-record wizard

> **Later wave** after Guided Path v2.1 feels calm in real use. Craft + education only.
> Inherit `AGENTS.md`. Never diagnose. Never title screens “CBT homework”.

---

## 1. Approach packs (`APPROACH_PACKS` in `data.js`)

Four educational collections (Calm → Also here or library section):

| Pack id | Title | Skills (examples) | Footnote |
|---|---|---|---|
| thoughts | Working with thoughts | thought-record, defusion, worry-vs-problem | Related ideas appear in CBT / ACT education |
| body-alarm | When the body alarms | physiological-sigh, box-breathing, grounding-54321, pmr, cold-water | DBT distress-tolerance education often includes body-first moves |
| low-energy | When energy is low | behavioural-activation, ten-minute-walk, opposite-action | Behavioural activation ideas |
| feelings-hot | When feelings run hot | humming, rocking, ice-hold, burst-movement | TIPP-adjacent education |

UI: pack card → list of `skillCard`s + experience links. One Begin accent max.

---

## 2. Distortion lens (optional, post-journal or post-path)

After save, sheet with **one** of four questions (rotate / user pick):

- Was the mind jumping to the worst?
- All-or-nothing?
- Reading minds?
- Always / never?

Answers store in `lensNotes: [{ t, kind, entryId? }]`. May offer “Open thought record”.  
Never: “You have cognitive distortions.”

---

## 3. Thought-record wizard

Multi-step sheet over `thought-record` skill:

1. Situation (short)  
2. Thought  
3. Feeling word (chips from `EMOTION_WORDS`)  
4. Evidence for / against  
5. Kinder reframe  
6. Save → journal entry + optional skillRun  

Every text field: `wireSafetyText`. Tier-3 → Help.

---

## 4. Tests

- Pack opens; no diagnosis lexicon  
- Wizard completes to journal  
- Lens dismissible  

## 5. Ship

Separate version bump (e.g. 2.2.0 / `soulcap-v220`) after v2.1 green.
