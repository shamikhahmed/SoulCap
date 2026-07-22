# SoulCap Privacy Contract

**Version:** 1.2.0

## Promise

SoulCap has no account, server, analytics, advertising SDK, remote model, cloud speech fallback,
CDN, or telemetry. The shipped PWA makes zero third-party requests and all user state remains in
the browser's local storage unless the user explicitly exports a file.

## Data inventory

- Profile and optional personal history
- Arrival check-ins and optional dimensions, direct needs, tags, and short phrases
- Exercise history, favourites, and helpful/not-helpful feedback
- Journal entries, stickers, and down-scaled local images
- Constellation people, closeness, optional links, and optional contact timestamps
- Safety-plan text
- Theme, presentation, voice, haptic, and personalisation settings
- Chosen daily supports and per-local-day completion IDs

No location, contacts, message contents, microphone audio, advertising identifiers, or account
credentials are collected.

## Device integrations

- Journal transcription is available only when the browser confirms an already-installed,
  on-device speech-recognition path with `processLocally: true`. Audio is not stored.
- Spoken guidance uses only voices marked `localService: true`.
- Photos are decoded and down-scaled with browser APIs before local persistence.
- “Message someone I trust” opens the operating system's messaging app with an empty recipient and
  empty draft. SoulCap does not select or contact a person.

## Local analysis

Recommendation ranking and patterns use controlled fields only. Pattern evidence is a list of
local check-in IDs/dates and never includes journal text. The optional check-in phrase is checked
against the offline safety keyword kernel so hard-coded Help can appear for explicit tier-3
wording. It is not transmitted, embedded, classified remotely, or reused for pattern mining.
Library search compares typed text against bundled article titles, summaries, and tags in memory.
Daily-support completion stays separate from recommendation and pattern scoring.

## User control

- Every optional check-in detail can be skipped.
- Pattern observations can be inspected, corrected, hidden, or disabled.
- Daily supports can be selected or removed at any time; no streak or adherence score is derived.
- Export produces a local JSON file under user control.
- Delete removes the canonical state and display mirrors. There is no remote copy to delete.
- SoulCap has no retention schedule because it has no server-side custody; browser storage lasts
  until the user, browser, or operating system clears it.

## Threat model and limits

Local-only is not equivalent to encrypted-at-rest. Anyone with access to an unlocked device,
browser profile, backup, or developer tools may be able to read localStorage. Private browsing,
storage pressure, or browser cleanup may remove data. SoulCap must not imply secure cloud backup,
multi-device sync, medical-record protection, or recovery after deletion.

Any future sync, clinician portal, account, remote model, or analytics proposal requires a new
architecture decision, authentication and authorization design, encryption and key-management
plan, retention/deletion policy, incident response, consent flow, and independent security review.
