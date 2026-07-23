# SPEC v2.1 — Guided Path (build guide for Cursor)

> **Execution spec.** Offline, rule-based feeling → chips → family why → one exercise.
> Never diagnose. Never prescribe CBT/DBT/ACT as treatment. Inherit `AGENTS.md` hard rules.

**Version target:** 2.1.0 / `soulcap-v210` / schema **v12**  
**Sister docs:** `docs/SISTER-REPLY-guided-path.md`, `docs/SISTER-REVIEW-KIT-guided-path.md`

---

## 0. Overrides

- Screen and teach. **Never diagnose.**
- Recommend **exercise families** (Nervous system / Thinking / Doing…). Educational footnote may mention CBT/DBT/ACT/BA as ideas people learn elsewhere — never “start CBT”.
- No severity scores, streaks, crisis phone numbers, LLM, network.
- Clinical “not reviewed” honesty stays on path result.

---

## 1. Content (`docs/data.js`)

```js
var PATH_UI = { /* cardTitle, cardHint, calmHint, arrivalTitle, chipsTitle, chipsHint,
  continue, skip, resultTitle, begin, somethingElse, readAbout, offerHelp,
  offerHelpHint, disclaimer, footnote, knowsLabel, clear, hideCard, showCard, close,
  maxChips, advancedTitle, advancedHint */ };

var PATH_ARRIVALS = [
  { key:'Wired', label:'Wired', checkin:'Wired' },
  { key:'Heavy', label:'Heavy', checkin:'Heavy' },
  { key:'Flat', label:'Flat', checkin:'Flat' },
  { key:'Overwhelmed', label:'Overwhelmed', checkin:'Wired' }, // maps check-in to Wired
  { key:'Not sure', label:'Not sure', checkin:'Not sure' }
];

var PATH_CHIPS = [
  { id:'heart', label:'Heart racing / body alarm', families:{ autonomic:3, sensory:1 },
    experiences:['racing-heart'], skills:['physiological-sigh','grounding-54321'], panicHint:true },
  { id:'worry', label:'Worry / what-ifs', families:{ cognitive:3, sleep:1 },
    experiences:['catastrophising'], skills:['worry-vs-problem','thought-record'] },
  { id:'spin', label:'Thoughts won’t stop', families:{ cognitive:3, load:1 },
    experiences:['racing-thoughts','rumination'], skills:['defusion','count-backwards'] },
  { id:'tension', label:'Tight muscles / can’t settle', families:{ autonomic:3 },
    experiences:[], skills:['pmr','box-breathing'], panicHint:true },
  { id:'sleep', label:'Sleep is hard', families:{ sleep:3, autonomic:1 },
    experiences:[], skills:['wind-down','worry-postponement','stimulus-control'] },
  { id:'avoid', label:'Avoiding / shutting down', families:{ activation:3, cognitive:1 },
    experiences:[], skills:['behavioural-activation','values-check','opposite-action'] },
  { id:'low', label:'Flat / no energy', families:{ activation:3, connection:1 },
    experiences:[], skills:['behavioural-activation','ten-minute-walk'] },
  { id:'edge', label:'On edge / scanning', families:{ orienting:2, autonomic:2, cognitive:1 },
    experiences:['hypervigilance'], skills:['orient-room','feet-floor','physiological-sigh'] }
];

var PATH_ADVANCED = [
  { id:'allornothing', label:'All-or-nothing thinking', families:{ cognitive:2 },
    skills:['thought-record','defusion'] },
  { id:'mindread', label:'Mind-reading', families:{ cognitive:2 },
    skills:['thought-record','defusion'] },
  { id:'overgeneral', label:'Always / never thinking', families:{ cognitive:2 },
    skills:['thought-record','worry-vs-problem'] }
];

var PATH_REASONS = {
  autonomic: 'When the body is loud, starting with the nervous system often helps more than arguing with thoughts.',
  sensory: 'Anchoring through the senses can interrupt a spiral without needing the right words.',
  orienting: 'Checking the room tells a threat-primed body that it has looked around.',
  load: 'A short structured task can occupy the space a thought-loop needs to run.',
  soothing: 'Gentle rhythm and touch you give yourself can lower intensity a notch.',
  imagery: 'A vivid safer scene can give the body something else to respond to — only if it feels okay.',
  sleep: 'Night and sleep ask for different moves than daytime spikes.',
  cognitive: 'When there is a little room, looking at a thought as a thought can loosen its grip.',
  activation: 'Small outward action can shift mood from the outside in when energy is low.',
  connection: 'A tiny step toward people can reverse withdrawal — only if it feels safe enough.'
};
```

---

## 2. State (schema v12)

```js
pathSessions: [], // { id, t, arrival, chips[], family, skillId, helped? }
pathPrefs: { hide: false }
```

Migrate `version < 12` in `migrateState`.

---

## 3. Logic (`docs/app.js`)

- `scorePathFamilies(chips)` → top family  
- `pathPanicCluster(chips)` → true if ≥1 panicHint chip and arrival Wired/Overwhelmed, or ≥2 panicHint  
- `suggestPathSkills(family, chips)` → filter SKILLS by family + chip skill hints, capacity, traumaCaution; sort helpfulScore  
- `pathSheet()` multi-step sheet: arrival → chips → result  
- Persist session on Begin / finish result  
- Optional: if no check-in today, `recordCheckin` from arrival.checkin  

---

## 4. UI

- Now quiet: card if `!pathPrefs.hide`  
- Calm Also here: calm-tool card  
- Result: family why, footnote, disclaimer, Begin, something else, read about (first experience), Help offer if panic cluster  
- What SoulCap knows: recent path lines + clear  

---

## 5. Forbidden copy (e2e assert absent on path UI)

`diagnos`, `you have`, `disorder`, `prescrib`, `start CBT`, `start DBT`, `your therapy`, `severity`

---

## 6. Tests

- Complete path → runner visible  
- Panic cluster shows Help offer  
- No forbidden lexicon in sheet text  
- Schema migrates to v12  
- Settings/path hide optional (if shipped)

---

## 7. Ship

Bump `APP_VERSION` 2.1.0, `CACHE` soulcap-v210, VERSION.json, CHANGELOG, SAFETY, HANDOVER, ROADMAP.
