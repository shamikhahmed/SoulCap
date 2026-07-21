# SoulCap

**v0.8.0 — offline-first wellness PWA.** A calm, private, personalised space for self-regulation
skills, a journal, and a map of the people around you. **Not** therapy · not a diagnosis tool ·
not a crisis service · not an AI therapist. See [`SAFETY.md`](SAFETY.md).

> **New here? Read [`AGENTS.md`](AGENTS.md)** (build guide + rules) and [`ROADMAP.md`](ROADMAP.md)
> (what's next, in detail). [`.cursorrules`](.cursorrules) is the short version for Cursor.

---

## What ships (live)

| Surface | URL / path | Reality |
|---|---|---|
| **PWA** | [shamikhahmed.github.io/SoulCap](https://shamikhahmed.github.io/SoulCap/) · `docs/` | The product. Five tabs (Now · Calm · Journal · People · You), 37 techniques with a guided timed runner + Apple-Watch-style breathing, a book-style journal with templates, verified local transcription, photo cover, search and month contents, the orbiting Constellation, optional history, purple (logo) theme, light/dark/night, voice + haptics. **Zero network calls — localStorage only.** |
| Nest API | `backend/` | Full module **source** (LMM, safety gate). Builds clean, **not deployed**; PWA does not call it. |
| Expo | `mobile/` | Thin client source. Lab only. |

Demo walkthrough → `?demo=1`.

**No crisis phone numbers or country selection ship** (owner decision — we can't promise any line
is reachable). Help is gentle, number-free guidance: reach out to someone you trust; contact local
emergency services if in danger.

---

## Personalisation honesty

The PWA uses deterministic check-ins, Calm context filters, and local history to fit suggestions.
It has no chat surface and no live LLM. Nest + model providers exist only in undeployed
`backend/` source.

---

## Architecture

```
SoulCap/
├── docs/             # ← live product (GitHub Pages)
├── backend/          # NestJS source lab (not production)
├── mobile/           # Expo source lab
├── icons/
├── CLINICAL.md · SAFETY.md · FEATURES.md
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
