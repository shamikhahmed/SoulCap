# SoulCap — Information Architecture rationale

**Version:** 8.0.2 · **Spec:** `SPEC-v8-ia-and-gallery.md`  
**Standard:** Apple Settings / Linear / Notion — most-changed near top, destructive & legal at bottom; one idea per screen.

This document explains **why** surfaces are grouped the way they are. The gallery captions link here.

---

## Principles

1. **One home, one purpose.** No duplicate CTAs for the same job.
2. **Discoverable tools.** Depth features (self-concept, habits, screeners) sit one tap from You — not buried under nested “more” menus.
3. **Settings is chrome, not content.** Gear (or top row) opens Settings; never the last row after a long scroll.
4. **Honest empty.** Cold-open shows a labelled **Example / Preview**, never fake streaks, scores, or history as the user’s own.
5. **Screen-reader first.** Decorative dots hide from AT; one summary label speaks for a week glance.

---

## Tab-by-tab (W3)

### Now — “How am I arriving, and what helps next?”
| | |
|---|---|
| **For** | Daily arrival check-in + one suggested technique + quiet week glance. |
| **Above the fold** | Greeting · arrival rows · Begin suggestion. Week glance secondary. |
| **Primary** | Arrival state · Begin. |
| **Secondary** | Path / experience picker / wind-down (under “Also here”). |
| **Not here** | Full progress dashboard, Settings, depth tools. |
| **Moved/cut** | Week glance keeps one SR summary; empty check-ins get Example week preview, not barren-only copy. |

### Calm — “What do I need right now?”
| | |
|---|---|
| **For** | Need chips → technique suggestions; library & supports as secondary. |
| **Above the fold** | Need picker · top suggestion. |
| **Primary** | Pick a need / start a technique. |
| **Secondary** | Browse library, daily supports, reset menu. |
| **Not here** | Journal writing, constellation editing, Settings. |

### Journal — “Private words”
| | |
|---|---|
| **For** | Book-style private writing. |
| **Above the fold** | Cover / New entry. |
| **Primary** | Write or open an entry. |
| **Secondary** | Cover edit, prompts. |
| **Not here** | Check-ins, pattern cards, Settings. |

### People (Map) — “Who is around me?”
| | |
|---|---|
| **For** | Private constellation — only on this device. |
| **Above the fold** | Map stage or empty purpose. |
| **Primary** | Add / open a person. |
| **Secondary** | Links, last-spoke (Settings-controlled). |
| **Not here** | Techniques, journal, Settings. |

### You — “Identity, tools, quiet progress”
| | |
|---|---|
| **For** | Who you are here · tools you return to · a compact week glance. |
| **Above the fold** | Hero + **Settings gear** · **Your tools** (discoverable). |
| **Primary** | Open a tool · open Settings · open profile once. |
| **Secondary** | Compact “This week” → See more · Story · What SoulCap knows. |
| **Not here** | Full stats dump as the main scroll; Settings at the bottom; duplicate “Set up profile”. |
| **Decision (tools high)** | Personas need depth tools in panic-calm recovery and reflection — burying them under “About” failed discoverability. Tools sit directly under the hero. |

---

## You-tab structure (W1)

Order on `#view-me`:

1. **Hero** — name / “Your space” + day line + **Settings gear** (first-class).
2. **Your tools** — Two versions of you · Habit support · Reflection check · My plan · Principles · My manual. Each row: label + purpose + chevron · `button` · ≥48px.
3. **This week** — compact glance (one SR summary) + **See more** → weekly overview. Not the whole progress dashboard inline.
4. **About you** — **one** Profile entry · Your story · What SoulCap knows. (About & Legal lives in Settings.)
5. Help affordance.

**Duplicate profile removed:** cold empty no longer adds a second “Set up profile” CTA; Profile lives only in About you.

---

## Settings groups (W2)

Order matches big-company convention — change often → top; destroy / legal → bottom.

| Group | Contains | Why |
|---|---|---|
| **Appearance** | Theme (incl. Ocean/Forest ambient) · Accent | Most-changed visual prefs; Language **not** nested here. |
| **Language** | Locale chips + preview honesty | Own group — language is not “look”. |
| **Accessibility** | Motion · text · density · contrast · transparency | AT / comfort; separate from cosmetics. |
| **Personalisation** | Pattern toggle · hide short path · guided voice/haptics/pace/wind-down · constellation pace/links/contact | Behaviour prefs that shape suggestions & map — not chrome. |
| **Privacy & Data** | On-device note · Export · Delete (confirm) | Destructive near bottom. |
| **About & Legal** | About sheet · version · not-medical line | Bottom. |

**Search:** filter field at top of Settings — list spans >2 screens with guided + constellation options.

---

## Cold-open / empty (W4)

| Surface | Strategy |
|---|---|
| Now / You week glance | Labelled **Example** week (decorative dots) when no real activity — copy says not your data. |
| Patterns / Weekly empty | Honest empty + optional Example caption — never invented scores. |
| You cold | Purpose line only; profile via single About row. |

Never: fake streaks, fake history as “yours”, or scores presented as clinical.

---

## Accessibility notes (W5)

- Week dots: `aria-hidden="true"` on the dot row; **one** summary on the control (`aria-label`).
- Interactive rows: real `<button type="button">` via `listRow` / `qdRow`.
- Settings / You / Journal / Runner / Screener / Panic: re-verified for focus order and 200% text in e2e.

---

## Clinical honesty (W7)

Pattern cards, screeners, and local insights remain **not clinician-reviewed**. About & Legal keeps the single not-medical line. See `SAFETY.md`.

---

## Gallery (W6)

`screen-gallery.html` groups shots by tab. Captions cover what / how selected / how state kept / why (this file). Manifest fields: `caption`, `tab`, `state`.
