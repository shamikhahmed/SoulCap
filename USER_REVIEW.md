# SoulCap v0.8.1 — Synthetic User Review

**Reviewed:** 2026-07-21  
**Scope:** onboarding, Help, Now, Calm, journal, Constellation, persistence, privacy, mobile,
desktop, reduced motion, marketing page, and screenshot gallery.

## Method and limits

Five isolated Playwright browser profiles followed realistic end-to-end journeys on mobile and
desktop. Each profile had separate local storage. These are synthetic usability sessions, not
human research: software agents do not feel. The emotional notes below are likely perceptions
inferred from copy, interaction load, safety behaviour, and visible friction.

## Persona results

### Aisha — overwhelmed newcomer

Journey: opened Help before consent, returned safely, completed the 18+ gate, chose panic as a
concern, then requested discreet Calm options around people.

Likely perception: contained and not trapped. Help is reachable before onboarding, language is
non-demanding, and discreet filtering respects social context. Initial Calm list is long on a
phone, but each choice is plain and the main action remains clear.

### Maya — privacy-conscious journaler

Journey: opened a journal template, tried unsupported transcription, wrote and saved an entry,
searched for it, then reloaded the app.

Likely perception: reassured and in control. Unsupported voice gives a direct local-only
explanation, ordinary typing remains available, and the saved entry survives reload. Search and
book-like contents make the journal feel useful rather than decorative.

### Daniel — low-energy returning user

Journey: recorded a Heavy check-in, asked to lift a low mood, opened a fitted skill, then stopped
without completing it.

Likely perception: low pressure after the capacity-filter fix. Skills marked for any capacity now
remain available when energy is low, and stopping creates no streak loss, warning, or guilt.

### Samira — relationship-stressed user

Journey: opened Constellation, added a person with relationship and support context, and confirmed
the record stayed inside local state with no external request.

Likely perception: private and respectful. A nickname is enough, closeness is user-defined, and
the product does not frame reconciliation as an obligation.

### Leo — motion-sensitive keyboard user

Journey: enabled reduced motion, opened the journal editor, checked toolbar targets, closed by
keyboard, then opened Help from the installed-app query shortcut.

Likely perception: calm and operable. Editor controls meet the 48px target, reduced-motion timing
is effectively immediate, Escape closes the editor, and Help remains directly reachable.

## Findings

### Resolved — capacity `any` was excluded for low-energy users

- **Severity:** High
- **Business impact:** Core personalization could appear broken at the moment it matters most.
- **User impact:** A Heavy check-in followed by “Lift a low mood” could return no technique cards.
- **Fix complexity:** Low
- **Resolution:** Added one capacity-matching rule used by both Now suggestions and Calm results.
  `any` now means usable at every current capacity. Persona regression coverage added.

### Resolved — product gallery overflowed on phones

- **Severity:** Medium
- **Business impact:** Marketing page looked desktop-scaled and reduced install confidence.
- **User impact:** Horizontal overflow made the gallery and navigation hard to use on a phone.
- **Fix complexity:** Low
- **Resolution:** Allowed product rail and main grid items to shrink, bounded the mobile rail to
  the viewport, and bumped the website CSS cache key.

### Accepted — browser storage is not app-encrypted

- **Severity:** Medium
- **Business impact:** Privacy claims must stay precise; device compromise can expose local data.
- **User impact:** Journal content relies on browser and OS protections.
- **Fix complexity:** High
- **Recommended solution:** Keep current disclosure prominent. Do not claim encryption. Evaluate
  optional encrypted export or a separately designed encrypted store before promising stronger
  protection.

### Accepted — local transcription support is limited

- **Severity:** Low
- **Business impact:** Voice journaling will not work on many current browsers.
- **User impact:** Some people must type instead.
- **Fix complexity:** Medium
- **Recommended solution:** Keep the safe unsupported state. Do not add a remote-capable fallback.
  Reassess only when browsers expose reliable local processing.

## Cross-functional review

- **Security:** No account, analytics, remote model, CDN, or app-level external request. Journal
  voice test verifies local-only behaviour. Save failures preserve retryable drafts. Main known
  boundary is unencrypted browser storage.
- **UX:** Warm hierarchy, one dominant action, no engagement pressure, and reversible exits.
  Journal is now a coherent book workflow. Calm still benefits from future real-user testing under
  acute stress.
- **Mobile:** 390px gallery has no horizontal overflow. App screenshots cover mobile, iPad, and
  Mac. Journal tools scroll safely and core targets are at least 48px.
- **Accessibility:** Minimum app text is 15px, dialogs are named, live transcription status is
  announced, reduced motion is honoured, and keyboard Escape works in the editor. Screen-reader
  testing on VoiceOver remains a human-device follow-up.
- **Product:** v0.8 strengthens the private emotional operating-system position without adding a
  chatbot or dependency loop. Success still points toward leaving the app, not increasing usage.
- **Investor readiness:** Gallery, copy, version, privacy promise, and shipped feature set now
  match. Clinical efficacy, PMF, retention, and willingness-to-pay remain unvalidated and must not
  be implied.

## Release evidence

- 132 Playwright checks across mobile and desktop.
- Five synthetic personas, each executed in both projects.
- Ten deduplicated SoulCap gallery captures: eight phone screens, one iPad, one Mac.
- Static website product page reviewed for content, gallery wiring, launch link, version, and
  mobile overflow.

