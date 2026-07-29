# SoulCap

**v7.0.12 — offline-first wellness PWA.** Quiet Depth visual identity (SPEC-v7) complete —
see [`REDESIGN-DIFF.md`](REDESIGN-DIFF.md). **Not** therapy · not diagnosis · not crisis service.
See [`SAFETY.md`](SAFETY.md).

> **New here? Read [`AGENTS.md`](AGENTS.md)** (build guide + rules) and [`ROADMAP.md`](ROADMAP.md)
> (what's next). [`.cursorrules`](.cursorrules) is the short version for Cursor.

---

## What ships in this working tree

| Surface | URL / path | Reality |
|---|---|---|
| **PWA** | [shamikhahmed.github.io/SoulCap](https://shamikhahmed.github.io/SoulCap/) · `docs/` | The product (**7.0.12** / schema **v13**). Quiet Depth identity. Five tabs, Guided Path, Settings + About & Legal, Personal Manual, Thought Parking, optional detailed check-ins, inspectable local patterns, self-concept reflection, habit-loop / urge surfing, 38 techniques (incl. urge-surfing), offline library, no-streak daily supports, book-style journal, Constellation, Roman Urdu chrome preview, Help on free-text, curated themes + Accessibility group, voice + haptics. **Zero network calls — localStorage only.** |
| Nest API | `backend/` | Full module **source** (LMM, safety gate). Builds clean, **not deployed**; PWA does not call it. |
| Expo | `mobile/` | Thin client source. Lab only. |
| **Screen gallery** | [`screen-gallery.html`](screen-gallery.html) · `docs/screenshots/gallery/` | Every major screen + kept themes + appearance axes. `npm run gallery` → `npm run gallery:view`. |

Demo walkthrough → `?demo=1`.

**No crisis phone numbers or country selection ship** (owner decision). Help is gentle,
number-free guidance only.

---

## Personalisation honesty

Deterministic check-ins, direct needs, Calm context filters, and local history fit suggestions.
Pattern cards need repeated evidence, show confidence, and can be corrected or hidden. Self-concept
mask effort is the user's rating, never the app's. No chat surface, no live LLM.

---

## Architecture

```
SoulCap/
├── docs/             # ← live product (GitHub Pages)
│   └── screenshots/gallery/   # Playwright screen gallery assets
├── screen-gallery.html        # local viewer (pack + variant filters)
├── backend/          # NestJS source lab (not production)
├── mobile/           # Expo source lab
├── e2e/              # Playwright (verify gates deploy; gallery opt-in)
├── ARCHITECTURE.md · DATA_MODEL.md · PRIVACY.md
├── ACCESSIBILITY.md · EVALUATION.md · SAFETY.md
├── CLINICAL.md · FEATURES.md
└── VERSION.json
```

---

## Local PWA

```bash
npm run dev
# open http://localhost:8788/?demo=1

npm run gallery          # regenerate screenshots (CAPTURE_GALLERY=1)
npm run gallery:view     # http://127.0.3.1:8790/screen-gallery.html
npm run verify           # full Playwright suite before ship
```

Backend / Expo: see `backend/README` and `mobile/` — not required for the live Cap.

---

## Cap Family

Built by **Capricorn Systems** · Shamikh Ahmed · [hub](https://shamikhahmed.github.io/)
