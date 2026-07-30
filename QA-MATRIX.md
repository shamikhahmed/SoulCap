# SoulCap — Interactive QA matrix

**Version:** 8.0.2 · Updated **2026-07-30**  
**Method:** Every primary control class below was exercised via Playwright e2e and/or live Chromium against `/?demo=1` or `freshThrough`. Failures fixed before ship; re-verify = `npm run verify`.

Legend: **P** = pass (live/e2e) · **N/A** = surface absent by product law.

---

## Skip (product law)

| Area | Reason |
|------|--------|
| Sign-in / OAuth / password | No auth (Appendix E). |
| Push / badge notifications | None (Appendix I). |
| Crisis phone dialers | Number-free help only. |
| Network API forms | Offline-only. |

---

## Global chrome

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| All tabs | `#tabs` 5 buttons | Switch view, `aria-selected`, ≥48px | Works | P | `Smoke` / `all five tabs` |
| Splash | `#splash` | Brand quiet; exits; RM short | Works | P | Live boot + CSS RM |
| FAB / Help | Header Help / panic entry | Opens help; no numbers | Works | P | `safety.spec` |
| Sheet | `#sheet` open/close | Focus restore; scroll restore | Works | P | Cover sheet + theme tests |
| Skip link | Skip to content | Moves focus | Works | P | Markup + a11y docs |

---

## Welcome / onboarding

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Welcome | Begin | Starts onboarding | Works | P | `freshThrough` |
| Welcome | I need help now | Help / panic path, no phones | Works | P | safety |
| Onboarding | Age 18+ | Under-18 declined | Works | P | safety age |
| Onboarding | Consent | Required before app | Works | P | freshThrough |
| Onboarding | Steps | One idea / step; progress | Works | P | personas |

---

## Now

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Now | Arrival / check-in rows | Save check-in; ranking | Works | P | `Check-ins` / v0.9 |
| Now | Begin / suggestion | Opens technique | Works | P | Skills / path |
| Now | Week glance `.progress-glance` | One `aria-label`; dots `aria-hidden` | Works | P | SPEC-v8 IA |
| Now | Cold Example week | `.is-preview` + badge; not user data | Works | P | Cold-open test |
| Now | Short path | Optional; hide in Settings | Works | P | Guided Path |
| Now | Wind-down card | After hour; no guilt | Works | P | wind-down |
| Now | What's happening picker | Opens experience → runner | Works | P | v1.9 |

---

## Calm

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Calm | Need chips | Multi / Nothing exclusive | Works | P | Calm context |
| Calm | Technique cards | Open runner | Works | P | Skills |
| Calm | Library search | Offline articles; SR count | Works | P | v1.0 library |
| Calm | Daily supports | Persist day; no streaks | Works | P | daily supports |
| Calm | Also-here tools | Secondary only | Works | P | v2.0 IA |

---

## Journal

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Journal | New entry | Editor opens | Works | P | Journal |
| Journal | Save / edit | Persist; rollback on fail | Works | P | Journal fail tests |
| Journal | Cover customise | Colour / photo on-device | Works | P | cover tests |
| Journal | Search / months | Filter | Works | P | search test |
| Journal | Mic (local) | No external request | Works | P | transcription tests |
| Journal | Keyboard-open state | Gallery + editor usable | Works | P | gallery W6 |

---

## People (Map)

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Map | Add / open person | Local only | Works | P | safety constellation |
| Map | Links / rings | Persist | Works | P | constellation |
| Map | Empty state | Designed purpose copy | Works | P | gallery empty |

---

## You

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| You | Settings gear | First-class; opens Settings | Works | P | SPEC-v8 + live |
| You | Your tools rows | ≥48px; tools before About | Works | P | SPEC-v8 |
| You | Profile | **One** Set up / Profile entry | Works | P | setup count = 1 |
| You | Week glance | One SR summary | Works | P | SPEC-v8 |
| You | See more / tools depth | Self-concept, habits, screener | Works | P | V13 engines |
| You | No bottom Settings row | Absent | Works | P | SPEC-v8 |

---

## Settings (sheet)

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Settings | Search | Filters groups | Works | P | live + UI |
| Settings | Appearance | Theme + accent; first group | Works | P | live order |
| Settings | Language | Own group (not under Appearance) | Works | P | live |
| Settings | Accessibility | Motion/text/density/contrast | Works | P | presentation tests |
| Settings | Personalisation | Patterns, path, voice, map, wind-down | Works | P | settings tests |
| Settings | Privacy & Data | Export / Delete confirm | Works | P | safety delete |
| Settings | About & Legal | Version = `APP_VERSION` | Works | P | live `8.0.x` |
| Settings | Theme change | No scroll jump to top | Works | P | theme scroll test |

---

## Overlays — Runner / Panic / Screener

| Screen | Element | Expected | Actual | Result | Evidence |
|--------|---------|----------|--------|--------|----------|
| Runner | Steps / breath | Pace Slow/Steady/Brisk; abandon OK | Works | P | Skills |
| Runner | Pause / Resume | Freezes countdown | Works | P | V13 pause |
| Runner | Dialog semantics | `role` / label; 200% | Works | P | a11y |
| Panic | Help panel | Number-free; tier 3 | Works | P | safety |
| Screener | PHQ-9 item 9 | Opens Help; no severity verdict | Works | P | V13 screener |
| Screener | GAD-7 top band | Professional nudge; not diagnosis | Works | P | reflection |

---

## Themes / appearance axes

| Axis | Expected | Actual | Result | Evidence |
|------|----------|--------|--------|----------|
| Light / Dark / Night / AMOLED / Ocean / Forest | Contrast holds; tokens | Gallery + live | P | gallery themes |
| Accent Plum / Lilac / Mulberry | Selected distinct | Works | P | presentation |
| Motion Vivid / Balanced / Still + OS RM | Function kept | Works | P | RM gallery + CSS |
| Text Large / density Comfortable | 200% no clip key flows | Works | P | SPEC-v8 W5 |
| Contrast sample (hero ink) | ≥ 4.5:1 (AA) | **15.1:1** live | P | 2026-07-30 measure |
| Muted body | ≥ 4.5:1 | **6.35:1** live | P | measure |
| Selected tab | ≥ 3:1 UI | **5.05:1** live | P | measure |

---

## Privacy / offline / version

| Check | Expected | Actual | Result | Evidence |
|-------|----------|--------|--------|----------|
| External HTTP after load | None | Empty list | P | live + V13 guard |
| Offline reload | UI present | true | P | PERF live |
| What's-new body | Derives `APP_VERSION` | Template | P | 7.0.13+ |
| Demo mode | `?demo=1` labelled seed | Works | P | seedDemo |

---

## Residual clicks (accepted)

Not every decorative caption / every theme × every chip combo is a separate matrix row. Presentation axes are covered by gallery capture + Settings chips e2e. New interactive control → add a row here + an e2e assertion.
