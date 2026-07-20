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
