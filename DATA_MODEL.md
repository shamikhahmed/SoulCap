# SoulCap Data Model

**Schema:** 8 · **Storage key:** `localStorage['soulcap_v1']`

## State contract

The canonical shape starts in `DEFAULT` in `docs/app.js`. Top-level collections include check-ins,
skill runs, people, relationship links, journal entries, safety-plan answers, drip answers,
local user-model estimates, and user-controlled settings. Nested defaults must be merged
explicitly in `load()`.

### Check-in v6

```text
{
  id: string,          stable local ID
  t: number,           created/primary check-in timestamp
  updatedAt: number,   latest same-day edit timestamp
  state: string,       Steady | Wired | Flat | Heavy | Not sure
  dims: {              optional integer values, each 1..5
    energy?, tension?, noise?, social?, sleep?
  },
  triggers: string[],  optional controlled tags
  need: string,        optional controlled direct need
  feeling: string      optional short phrase, maximum 160 characters
}
```

One check-in exists per local calendar day. Re-selecting an arrival word updates the latest
same-day object instead of adding another object. Detail editing keeps the same `id`.

### Pattern preferences

```text
patternPrefs: {
  enabled: boolean,
  decisions: {
    [patternId]: 'confirmed' | 'rejected' | 'hidden'
  }
}
```

Patterns are derived views, not stored claims. Evidence IDs point to check-ins; decisions are the
only persisted pattern state. Rejecting or hiding a pattern does not delete evidence.

### Presentation

```text
appearance: {
  text: 'standard' | 'large',
  density: 'compact' | 'comfortable',
  accent: 'plum' | 'lilac' | 'mulberry' | 'indigo',
  contrast: 'standard' | 'high',
  reduceTransparency: boolean
}
```

`theme` remains independently `null | light | dark | night | ocean | forest | rain | space | sunrise | minimal | amoled`.
`locale` is `en` (default) or `ur` (RTL layout preview only).

### Daily supports

```text
dailySupports: {
  selected: string[],       user-chosen stable support IDs
  days: {
    [localDateKey]: string[]  support IDs marked on that local calendar day
  }
}
```

Daily supports store no streak, score, badge, reminder, or missed-day state. Deselecting a support
does not rewrite prior local-day records. Corrupt day values are ignored by the renderer.

### Adaptive drip + user model

```text
drip: {
  answers: { [questionId]: { v: number, t: number } },
  skipped: { [questionId]: number },
  dayKey: string,           local calendar day for the ask counter
  askedToday: string[]      question ids counted toward the day cap (max 4)
}

userModel: {
  [key]: {                  stress | sleep | energy | resilience
    value: number,          1..5 estimate
    confidence: number,     0..0.92 gradual confidence
    source: 'declared' | 'corrected',
    updatedAt: number
  }
}
```

Estimates are local, inspectable, and correctable. They are never diagnoses, scores, or clinical
results. Branching questions read prior estimate values only.

## Migration contract

`migrateState()` applies version steps before defaults are merged.

- v5 → v6 adds stable check-in IDs, detail containers, pattern preferences, and appearance.
- v6 → v7 adds the `dailySupports` container with empty selected and day collections.
- v7 → v8 adds `drip`, `userModel`, and `locale` (`en` default).
- Legacy inference decisions are converted to pattern decisions.
- Existing timestamps, arrival words, profile, journal, people, and all unrelated data remain.
- If migration persistence fails, migrated state may run in memory, but the original stored JSON
  is left intact. A later successful launch can retry.
- Future migrations must be additive and sequential (`if version < N`), with a Playwright fixture
  for the prior schema and a forced-storage-failure fixture.

## Write and deletion rules

- Check-in writes clone the prior collection and restore it when `localStorage.setItem` fails.
- Journal and media flows use their existing staged drafts and rollback behavior.
- Export serializes the complete state as JSON.
- Delete removes the canonical state and pre-paint mirrors, then returns to defaults.
- Never mutate or discard unknown future-version fields during a downgrade.
