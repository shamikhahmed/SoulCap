# SoulCap

**v4.0.1 — offline-first wellness PWA.** Master design foundations (Amethyst + composition kit);
Guided Path + approach packs; 37 techniques; journal; Constellation. **Not** therapy · not diagnosis · not crisis service.
See [`SAFETY.md`](SAFETY.md).

> **New here? Read [`AGENTS.md`](AGENTS.md)** (build guide + rules) and [`ROADMAP.md`](ROADMAP.md)
> (what's next, in detail). [`.cursorrules`](.cursorrules) is the short version for Cursor.

---

## What ships in this working tree

| Surface | URL / path | Reality |
|---|---|---|
| **PWA** | [shamikhahmed.github.io/SoulCap](https://shamikhahmed.github.io/SoulCap/) · `docs/` | The product (**4.0.1** / schema v12). Amethyst + v4 kit, five tabs, Guided Path, Settings + About, Personal Manual, Thought Parking, optional detailed check-ins, inspectable local patterns, 37 exercises, offline library (articles + 24 experiences), no-streak daily supports, book-style journal, Constellation, Roman Urdu chrome preview, Help on free-text, themes, voice + haptics. **Zero network calls — localStorage only.** |
| Nest API | `backend/` | Full module **source** (LMM, safety gate). Builds clean, **not deployed**; PWA does not call it. |
| Expo | `mobile/` | Thin client source. Lab only. |

Demo walkthrough → `?demo=1`.

**No crisis phone numbers or country selection ship** (owner decision — we can't promise any line
is reachable). Help is gentle, number-free guidance: reach out to someone you trust; contact local
emergency services if in danger.

---

## Personalisation honesty

The PWA uses deterministic check-ins, explicit direct needs, Calm context filters, and local
history to fit suggestions. Pattern cards require repeated evidence across distinct days, show
the evidence, and can be corrected or hidden. It has no chat surface and no live LLM. Nest +
model providers exist only in undeployed `backend/` source.

---

## Architecture

```
SoulCap/
├── docs/             # ← live product (GitHub Pages)
├── backend/          # NestJS source lab (not production)
├── mobile/           # Expo source lab
├── icons/
├── ARCHITECTURE.md · DATA_MODEL.md · PRIVACY.md
├── ACCESSIBILITY.md · EVALUATION.md · SAFETY.md
├── CLINICAL.md · FEATURES.md
└── VERSION.json
```

---

## Local PWA

```bash
cd docs && python3 -m http.server 8080
# open http://localhost:8080/?demo=1
```

Backend / Expo: see `backend/README` and `mobile/` — require Postgres, Redis, API keys. Not required for the live Cap.

---

## Cap Family

Built by **Capricorn Systems** · Shamikh Ahmed · [hub](https://shamikhahmed.github.io/)
