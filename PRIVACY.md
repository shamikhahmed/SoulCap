# SoulCap Privacy Contract

**Version:** 2.1.0 · **Updated:** 2026-07-23

## Promise

SoulCap has no account, server, analytics, advertising SDK, remote model, cloud speech fallback,
CDN, or telemetry. The shipped PWA makes zero third-party requests and all user state remains in
the browser's local storage unless the user explicitly exports a file.

## Data inventory

- Profile and optional personal history (“Your story”)
- Arrival check-ins and optional dimensions, direct needs, tags, and short phrases
- Exercise history, favourites, and helpful/not-helpful feedback
- Journal entries, stickers, emotion words, down-scaled local images, Thought Parking
- Constellation people, closeness, optional links, contact timestamps, notes, events, ring history
- Safety-plan text
- Theme, presentation, voice, haptic, locale, map pace, and personalisation settings
- Chosen daily supports and per-local-day completion IDs
- Reset menu items and same-day completion IDs
- Principles, Personal Manual lines, library bookmarks, reflection prefs
- Local drip answers and user-model estimates (never diagnoses)
- Optional PHQ-9 / GAD-7 reflection results (local score/band lines only — never a diagnosis)
- Guided Path sessions (arrival, chip ids, family, skill id) and pathPrefs (hide card)

No location, contacts, message contents, microphone audio blobs, advertising identifiers, or
account credentials are collected.

## Device integrations

- Journal transcription is available only when the browser confirms an already-installed,
  on-device speech-recognition path with `processLocally: true`. Audio is not stored.
- Spoken guidance uses only voices marked `localService: true`.
- Photos are decoded and down-scaled with browser APIs before local persistence.
- “Message someone I trust” opens the operating system's messaging app with an empty recipient and
  empty draft. SoulCap does not select or contact a person.

## Local analysis

Recommendation ranking and patterns use controlled fields only. Pattern evidence is a list of
local check-in IDs/dates and never includes journal text. Free-text surfaces (check-in phrase,
journal, story, plan, parking, notes, manual, principles, reflection) are assessed by the offline
keyword safety kernel so hard-coded Help can appear for explicit tier-3 wording. Text is not
transmitted, embedded, classified remotely, or reused for pattern mining.
Library search compares typed text against bundled article titles, summaries, and tags in memory.

## Export and delete

- Export downloads a JSON file of local state to the device; it does not upload.
- Delete permanently clears SoulCap keys and returns to defaults. There is no server copy to erase.

## Quota

All data (including base64 photos) shares one `localStorage` quota (~5MB typical). The app warns
when a journal entry has many photos and surfaces a calm notice when a save fails for quota.
