## [0.4.0] — 2026-07-21

Full PWA rebuild on Design System v1. Offline-first, local-only, no LLM.

### Fixed — safety
- **Inflected crisis phrasings escaped the safety gate.** `end my life` is not a substring of
  `ending my life`, so "I have been thinking about ending my life" scored tier 0. Crisis
  keyword lists now carry inflected forms in both `docs/app.js` and the Nest
  `SafetyGateService`. Found by the new e2e suite.

### Added
- Design System v1 — deep evergreen UI accent, warm green-cast neutrals, serif/sans two-register
  typography, both themes designed separately. Brand mark stays purple per `BRAND-LOCK.json`.
- **Constellation** — relationship map. You at centre, people placed by closeness across three
  rings. `hard right now` permanently suppresses suggestions for that person, with no
  reconciliation nudges. The app never contacts anyone.
- Offline skills engine — 17 cards across breath / rest / clarity / move / warmth / connect /
  reflect, with a step-by-step runner and helpfulness feedback.
- Suggestion engine with a stated reason on every suggestion, capacity filtering, and time-of-day
  weighting (sleep skills win late at night).
- Onboarding: 18+ age gate, region selection, plain-language consent, optional concerns.
- "What SoulCap thinks it knows" — trust tiers (you said / observed / a guess), guesses shown as
  questions the user answers rather than conclusions.
- Export and permanent delete on the main surface, not buried in settings.
- 54 Playwright e2e tests (mobile + desktop) covering risk tiers, false-positive guard, help
  reachability, age gate, Constellation suppression, a11y and offline.
- CI workflow — safety tests gate the Pages deploy.

### Changed
- Service worker rewritten: relative paths, cache-first for assets, network-first for navigation.
  Previous SW was network-first for everything, which broke offline on flaky connections.
- Crisis directory is region-aware. **No Pakistan-specific numbers ship** — none verified as
  live and staffed, so PK routes to the international directory. Absent beats wrong.
- SW `soulcap-v040`.

### Preserved
- `docs/legacy-v032.html` — previous release, still reachable.

## [0.3.2] — 2026-07-20

### Home deep — quiet room MOBILE≠DESKTOP
- Mobile: linen texture + room strip (half-open door, empty chair, light ray)
- Desktop ≥900px: 3-pane layout — room visual + check-in center + care rail (stats, habits, companion note, grounding)
- Sage orb glow (no purple takeover); clinical banner sage tokens
- SW `soulcap-v032`

## [0.3.0] — 2026-07-20

### Beauty — quiet journal / safety gate
- Splash journal cover; soft sage orb (no purple glow)
- Light+dark tokens + Appearance settings; theme-color aligned
- SW `soulcap-v030`

## 0.2.3
- Museum honesty: live check-ins/journals; demo seeds; SW soulcap-v023.
- Soften INVESTOR_DECK / PRESENTATION / HANDOVER: Smart Companion shipped; Nest = lab only.
- `?demo=1` always skips onboarding UI (half localStorage state); Skip on step 1 for non-demo.

## 0.2.2 — 2026-07-19

- Check-ins persist to `sc_checkins`
- Thin `docs/pitch.html` + Capricorn QR
- SW `soulcap-v022`

## 0.2.1 — 2026-07-19 — PWA truth + no dead ends

- README: live product = Pages PWA; Nest/Expo labeled source lab (not AI marketing).
- Profile: real journal/audit counts; privacy sheet; reminder preference; delete clears `sc_*`.
- `?demo=1` walkthrough; Capricorn QR in profile; SW `soulcap-v021`.
- Removed “coming soon” settings toasts.

# Changelog

## 0.2.0 — 2026-07-19 — Clinical path

- **CLINICAL.md** — SaMD gap checklist + clinician MVP + safety production rules.
- PWA: informed consent gate · keyword Tier-3 crisis rail (pause companion + Panic/988) · clinician panel (notes + audit) · escaped chat HTML.
- Backend: `ClinicalModule` `/api/v1/clinical/*` demo stubs · Prisma migrate baseline placeholder · `bcrypt` + `@nestjs/jwt` declared · safety-gate Jest unit tests.
- Version `0.2.0` · SW `soulcap-v020`.
- Honesty: **clinician-supported wellness companion / clinical path** — **not** a cleared medical device, not therapy, not diagnosis.

## 0.1.0 — 2026-07-19 — Cap Family Mega-Wave (safety-first)

- Added `VERSION.json` (0.1.0) and `SAFETY.md` (not clinical care; wired vs claimed; blockers).
- Honest README / FEATURES.md — no “production therapy” / clinical-grade marketing.
- Wired Cap Family brand icons into Expo `mobile/assets` + `docs/icons`; Expo `app.json` → SoulCap 0.1.0.
- Fixed mobile entry (`expo/AppEntry.js` + classic `App.tsx`); removed unused expo-router plugin.
- Bumped PWA SW cache to `soulcap-v010`.
- **Skipped:** clinical launch, store builds, full FE↔BE PWA wire.

## 2026-06-16 — Apple-quality visual redesign
- True black theme, specular orb, spring-physics overlays (PWA shell).

## 2026-06-15 — Complete PWA redesign
- Premium iOS-quality product polish across the PWA surface.

## 2026-06-14 — PWA added
- SoulCap PWA demo shell installable from browser alongside backend + mobile client source.

## 2026-06-13 — Initial release
- SoulCap AI emotional wellness platform: backend (Living Mind Model) + mobile client MVP source.
- Status: built source, not deployed. See HANDOVER.md / SAFETY.md.
