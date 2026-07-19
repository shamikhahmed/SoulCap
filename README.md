# SoulCap

**v0.2.3 — Clinical-path PWA.** On-device clinician-supported wellness companion. **Not** a medical device · not therapy · not crisis counseling. See [`CLINICAL.md`](CLINICAL.md) + [`SAFETY.md`](SAFETY.md).

> Crisis: call/text **988** (US) · text **HOME** to **741741** · [IASP](https://www.iasp.info/resources/Crisis_Centres/).

---

## What ships (live)

| Surface | URL / path | Reality |
|---|---|---|
| **PWA** | [shamikhahmed.github.io/SoulCap](https://shamikhahmed.github.io/SoulCap/) · `docs/` | Installable clinical-path shell. Journal, habits, check-in, companion chat (rules-based reflections), keyword safety tier, Panic/988, clinician notes + local audit. **localStorage only.** |
| Nest API | `backend/` | Full module **source** (LMM, safety gate, clinical stubs). **Not deployed.** |
| Expo | `mobile/` | Thin client source. **Not store-ready.** |

Cap Store **Try Demo** → `?demo=1` (consent + sample name prefilled for walkthrough).

---

## Companion honesty

Chat replies in the PWA are a **Smart Companion** (canned + keyword safety rails) — **not** a live LLM. Nest + model providers exist only in undeployed `backend/` source.

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
