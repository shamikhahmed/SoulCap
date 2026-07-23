# SoulCap Data Model

**Schema:** 10 · **Storage key:** `localStorage['soulcap_v1']` · **App:** 1.8.0

## State contract

Canonical shape starts in `DEFAULT` in `docs/app.js`. Top-level collections include check-ins,
skill runs, people, relationship links, journal entries, safety-plan answers, drip answers,
local user-model estimates, reset menu, parked thoughts, manual, principles, library bookmarks,
and user-controlled settings. Nested defaults must be merged explicitly in `load()`.

### Check-in

```text
{
  id: string,
  t: number,           primary / first same-day timestamp (preserved on edit)
  updatedAt: number,   latest same-day edit
  state: string,       Steady | Wired | Flat | Heavy | Not sure
  dims: { energy?, tension?, noise?, social?, sleep? },  // 1..5
  triggers: string[],
  need: string,
  feeling: string      max 160; tier-3 assessed
}
```

One check-in per local calendar day. Same-day edits keep original `t`.

### Pattern preferences

```text
patternPrefs: { enabled: boolean, decisions: { [patternId]: 'confirmed'|'rejected'|'hidden' } }
```

Patterns are derived views. Confidence label from distinct-day count (Low 3–7 / Med 8–14 / High 15+).

### Presentation & locale

```text
appearance: {
  text: 'standard'|'large',
  density: 'compact'|'comfortable',
  accent: 'plum'|'lilac'|'mulberry'|'indigo',
  contrast: 'standard'|'high',
  reduceTransparency: boolean
}
theme: null | light | dark | night | ocean | forest | rain | space | sunrise | minimal | amoled
locale: 'en' | 'rui'     // ur migrates → rui; dir always ltr
mapPace: 'still' | 'drift' | 'live'
```

### Daily supports

```text
dailySupports: { selected: string[], days: { [localDateKey]: string[] } }
```

No streak, score, badge, or reminder state.

### Adaptive drip + user model

```text
drip: {
  answers: { [questionId]: { v: number, t: number } },
  skipped: { [questionId]: number },
  dayKey: string,
  askedToday: string[]      // max 4 per local day
}
userModel: {
  [key]: { value: 1..5, confidence: 0..0.92, source: 'declared'|'corrected', updatedAt }
}
```

Estimates are never diagnoses.

### Reflection & growth (v1.3–v1.6)

```text
resetItems: [{ id, title, notes, enabled }]
resetDone: { [localDateKey]: string[] }   // completed reset item ids that day
parkedThoughts: [{ id, title, body, created, reopenAfter, archived }]
reflectionPrefs: { dismissedForever, lastShown }
pendingReflection: null | { trigger }
emotionFavorites: string[]
principles: string[]
manual: {
  lines: [{ id, section, text, source: 'auto'|'user', edited }],
  dismissedAuto: { [id]: true }
}
libraryBookmarks: string[]   // article ids
notices: { clinicalEnglishDismissed: boolean }
```

### Constellation person

```text
{
  id, name, type, ring, supportive, drain, hard, suggestible,
  lastContact, spokeAt: number[],
  notes: string,
  events: [{ id, t, label }],
  ringHistory: [{ t, ring }]   // capped (~20)
}
```

## Migration contract

`migrateState()` applies version steps before defaults merge.

- v5 → v6: check-in IDs, detail containers, patternPrefs, appearance
- v6 → v7: dailySupports
- v7 → v8: drip, userModel, locale
- v8 → v9: mapPace, resetItems, resetDone, parkedThoughts, reflectionPrefs, emotionFavorites, principles; `ur`→`rui`
- v9 → v10: manual, libraryBookmarks; person notes/events/ringHistory normalization

Additive and sequential. Playwright fixtures cover prior schema and forced storage failure.
Unknown future fields must not be discarded on downgrade.

## Write and deletion rules

- Check-in / preference writes clone prior state and restore on `setItem` failure.
- Journal and media use staged drafts and rollback.
- Export serializes complete state as JSON (local download only).
- Delete removes canonical state and pre-paint mirrors, then returns to defaults.
