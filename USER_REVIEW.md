# SoulCap v1.2.0 — Synthetic User Review

**Reviewed:** 2026-07-22
**Scope:** onboarding, Help, Now, optional check-in detail, local patterns, presentation controls,
Calm, offline emotional library, daily supports, journal, Constellation, persistence, privacy,
mobile, desktop, reduced motion, marketing page, and screenshot gallery.

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

### Noor — tired reader looking for context

Journey: opened Calm on a 390px viewport, searched the bundled library for sleep, opened the
article, reviewed support guidance and sources, then followed a stable link to a related exercise.

Likely perception: informed without being labelled. Search is immediate and offline, clinical
limits are explicit, and the article offers choices rather than declaring a diagnosis. Long-form
copy still needs human comprehension testing across literacy levels.

### Imani — avoiding habit pressure

Journey: selected water and daylight as daily supports, marked water for today, reloaded, then
confirmed the state remained a simple current-day choice with no score or streak.

Likely perception: optional rather than monitored. Nothing punishes a missed day, and completion
can be toggled off. The user must scroll selected cards above the fixed tab bar on a short screen;
normal page scrolling keeps every action reachable.

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

### Resolved — long articles initially focused their last action

- **Severity:** Medium
- **Business impact:** Educational content could appear to open halfway down, reducing trust.
- **User impact:** Focus moved to the first related-exercise button near the end of an article.
- **Fix complexity:** Low
- **Resolution:** Added a quiet Close control beside the article heading so modal focus begins at
  the top. Automated focus coverage now protects the reading start.

### Accepted — educational content has no clinician sign-off

- **Severity:** Medium
- **Business impact:** Any clinical or reviewed claim would be misleading.
- **User impact:** Guidance may be useful but has not received licensed content review.
- **Fix complexity:** High
- **Recommended solution:** Keep the in-product review-status notice. Record named, item-level
  sign-off before changing any claim.

## Cross-functional review

- **Security:** No account, analytics, remote model, CDN, or app-level external request. Library
  search stays in memory; daily-support writes roll back on storage failure. Main known boundary
  remains unencrypted browser storage.
- **UX:** Warm hierarchy, one dominant action, no engagement pressure, and reversible exits.
  Library and daily supports sit behind two compact Calm cards and disappear once guided filtering
  starts, preserving the original urgent path.
- **Mobile:** Manual 390×844 review found no horizontal overflow and a 54px smallest Calm control.
  Library and daily-support content scrolls above the fixed navigation.
- **Accessibility:** Body and input text remain readable, compact iPhone labels sit over 48px
  targets, large text and higher contrast are user-selectable, dialogs are named, live
  transcription status is announced, reduced motion is honoured, and keyboard Escape works in the
  editor. Screen-reader testing on VoiceOver remains a human-device follow-up.
- **Product:** v1.0 strengthens the private emotional operating-system position without adding a
  chatbot or dependency loop. Success still points toward leaving the app, not increasing usage.
- **Investor readiness:** Gallery, copy, version, privacy promise, and shipped feature set now
  match. Clinical efficacy, PMF, retention, and willingness-to-pay remain unvalidated and must not
  be implied.

## Release evidence

- 164 Playwright checks across mobile and desktop.
- Five existing synthetic persona journeys plus library and no-streak support scenarios.
- Manual 390×844 library and daily-support review: no overflow; all measured Calm targets ≥54px.
- Article contract audit: six complete records and all 18 related exercise links resolve.

