# SoulCap Accessibility Contract

**Version:** 5.1.0 · **Updated:** 2026-07-24

## Baseline

- Body and input copy stays at least 15px and browser zoom remains enabled.
- Compact iPhone chrome and metadata may use 9–14.5px where contrast is strong and the associated
  tap area remains at least 48px.
- Interactive controls have visible keyboard focus and semantic names.
- Dialogs are named, modal, focus-trapped, Escape-dismissable where safe, and restore focus.
- Colour is never the only carrier of meaning.
- Light, dark, night, AMOLED, and mood themes use semantic tokens rather than component hard-coding.
- `prefers-reduced-motion` collapses travel/scale/blur to short opacity fades (≤80–90ms) and
  **forces the Still motion preset** (overrides Vivid/Balanced).
- Movement preset (Vivid / Balanced / Still) is user-chosen; gestures and WebGL orb off in Still.
- Locale `rui` (Roman Urdu) is **LTR only** (Latin script). Clinical/safety strings stay English
  until a native clinical-copy review lands.
- Journal editor uses `:focus-visible` rings (not outline-less fields).

## User presentation controls

Theme and presentation are independent:

- Auto, light, dark, night, and mood themes (ocean, forest, rain, space, sunrise, minimal, amoled)
- Plum, lilac, mulberry, and indigo accents
- Standard and large text
- Compact and comfortable spacing
- Standard and higher contrast
- Standard and reduced transparency

Choices apply before first paint from validated local mirrors, then reconcile with canonical state.
Large text must not shrink tap targets, hide a primary action, or introduce horizontal overflow at
320px CSS width. Help and Exercise dialogs remain usable at 200% browser zoom (automated smoke).

## Check-in requirements

- The one-tap arrival words remain the fastest path.
- Optional detail sliders expose labels and current value text to assistive technology.
- Slider zero means “Not set”; recorded values are 1–5.
- Trigger and direct-need chips use `aria-pressed`.
- Skipping detail never blocks a recommendation.
- Save failure is announced in a visible named dialog and leaves prior data intact.

## Automated gates

Playwright covers mobile and desktop smoke, keyboard/dialog behavior, compact-label hierarchy,
48px targets, reduced motion, presentation persistence, slider naming, locale chrome, and no
horizontal overflow. Safety-critical accessibility is part of deploy-gating tests.

## Library and daily supports

- Library search has a semantic label and updates a finite result list without moving focus.
- Article cards and related-exercise links remain keyboard-operable and at least 48px high.
- Article sheets use named headings, plain lists, and the shared modal focus trap.
- Daily-support choices and current-day completion controls expose `aria-pressed`.
- Completion meaning is carried by text and state, never colour alone.

## Human gates before a public release

- VoiceOver on a current iPhone: onboarding, Now, detail sheet, Calm, journal, People, You, Help
- Dynamic Type/browser zoom at 200% on core paths
- Keyboard-only desktop pass including all sheets and dialogs
- Light, dark, night, AMOLED, and high-contrast visual review
- Reduced-motion review on breathing, maps, sheets, splash, and runner
- Touch review at 320px, 390px, and tablet widths

Automated checks do not certify WCAG conformance. Record human findings and device/browser versions
in `USER_REVIEW.md`.
