# SoulCap

**v8.1.1 — offline-first wellness PWA.** Quiet Depth visual identity (SPEC-v7) complete —
see [`REDESIGN-DIFF.md`](REDESIGN-DIFF.md). Full-phase audit: [`AUDIT.md`](AUDIT.md) ·
[`PERF.md`](PERF.md) · [`QA-MATRIX.md`](QA-MATRIX.md). **Not** therapy · not diagnosis · not crisis service.
See [`SAFETY.md`](SAFETY.md).

> **New here? Read [`AGENTS.md`](AGENTS.md)** (build guide + rules) and [`ROADMAP.md`](ROADMAP.md)
> (what's next). [`.cursorrules`](.cursorrules) is the short version for Cursor.

---

## What ships in this working tree

| Surface | URL / path | Reality |
|---|---|---|
| **PWA** | [shamikhahmed.github.io/SoulCap](https://shamikhahmed.github.io/SoulCap/) · `docs/` | The product (**8.1.1** / schema **v14**). Quiet Depth identity. Five tabs, Guided Path, Settings + About & Legal, Personal Manual, Thought Parking, optional detailed check-ins, inspectable local patterns, self-concept reflection, habit-loop / urge surfing, therapist-informed frameworks, techniques, offline library, book-style journal, Constellation, Roman Urdu chrome preview, region-aware Help, optional app lock. **Zero third-party network calls — localStorage only.** Privacy: [`docs/privacy.html`](docs/privacy.html). |
| Nest API | `backend/` | **Lab only** (P-SOUL-2). Full module source (LMM, safety gate). Builds clean, **not deployed**; excluded from GitHub Pages (`docs/` only). PWA does not call it. |
| Expo | `mobile/` | **Lab only** (P-SOUL-2). Thin client source. Excluded from Pages and from Tier 1 scoring. |
| **Screen gallery** | [`screen-gallery.html`](screen-gallery.html) · `docs/screenshots/gallery/` | Every major screen + kept themes + appearance axes. `npm run gallery` → `npm run gallery:view`. |

Demo walkthrough → `?demo=1`.

Help uses region-aware, officially verified emergency / talk lines (see [`SAFETY.md`](SAFETY.md)). SoulCap still isn’t a crisis service and can’t contact anyone for you.

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
