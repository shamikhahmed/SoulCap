# SoulCap — Perfection Loop v3 · INVENTORY

Seeded from §13.8 + `docs/index.html` tabs + `docs/app.js` (`galleryOpen` / sheets) + legacy gallery routes.  
Updated: 2026-10-14 · **P-SOUL-2:** `backend/` + `mobile/` excluded (lab only).

## Identity
- Name: **SoulCap** · quiet room (soft violet, slow motion) — safety-critical
- Stack: static JS PWA in `docs/` · own Pages · demo `?demo=1`
- Never: "therapy", "AI", "Living Mind" · Help never promotional

## Primary tabs (5)
| ID | Surface | Notes |
|---|---|---|
| now | Now | Simplified (Q-3 A); check-in, path, What's new |
| calm | Calm | Techniques, library, daily supports, runners |
| journal | Journal | Cover, list, editor, parking |
| map | Constellation / People | People map, add, person detail |
| me | You | Settings, Help, lock, export, frameworks, story |

## Routes / surfaces (code + galleryOpen)
| Route / kind | Screen | States |
|---|---|---|
| splash | Splash | first-run, reduced-motion |
| welcome | Welcome | Begin / I need help now |
| onboard/age | Age gate | 18+ / under-18 · **verbatim §4.3** |
| onboard/consent | Consent | required |
| onboard/name · concerns · motion | Onboarding steps | |
| onboard/under-18 | Under-18 decline | safety |
| tab/now | Now | empty, demo, cold-open preview |
| now/whats-new | What's new | |
| checkin/detail | Check-in detail | |
| drip | Gentle questions | |
| tab/calm | Calm | empty / filtered |
| calm/library · experiences · articles | Emotional library | search |
| calm/supports | Daily supports | |
| skill/* | Technique detail | |
| runner/* | Technique runner | breathing, thought-record |
| article/* | Library article | |
| experience · experience/picker | Experience | |
| path/start · path/result | Guided path | |
| tab/journal | Journal | empty / entries |
| journal/new · editor · cover | Journal compose | autosave |
| park-thought | Thought parking | |
| tab/map | Constellation | empty / people |
| map/add · map/person | Person flows | |
| tab/me | You hub | |
| me/plan · principles · manual · patterns · weekly · timeline · profile · story · knows | You subviews | |
| screener/pick · screener/run | Reflection screeners | |
| settings | Settings | theme, appearance, lock (G-10), export/import |
| about | About | honesty lines |
| help | **Help now** | region-aware; **never weaken** |
| reset-menu | Reset | confirm |

## Sheets / dialogs
- `#sheet` generic sheet (settings, skills, articles, frameworks, lock, export)
- Splash `#splash`
- Panic / Help entry from header (no phone dialers — number-free Help)
- App lock (CapLocalLock / G-10)

## Forms (summary)
| Form | Fields | Notes |
|---|---|---|
| Age gate | age band | safety copy locked |
| Consent | accept | required |
| Check-in | mood / notes | local only |
| Journal entry | title, body | autosave indicator |
| Technique timers | duration / steps | reduced-motion |
| Help region | region select | D-05 verified numbers in product |
| App lock | passcode | G-10 |
| Export / import | file | local |

## Network destinations
- **None after load** (offline-first). Privacy page must list any future exceptions. Lab backend not shipped.

## External links
- Hub support (`support.html`) per G-4 — no personal email/phone published.
