# SoulCap

**v0.2.0 — Clinical path.** Clinician-supported wellness companion. **Not** a medical device / not therapy / not crisis counseling. See `CLINICAL.md` + `SAFETY.md`.
 — AI Emotional Wellness Companion

**Version 0.2.0 · Pre-production** · Cap Family Mega-Wave (safety-first)

SoulCap is an **AI emotional wellness companion** built around a **Living Mind Model (LMM)** architecture — a psychological profile that can evolve with interaction. This repository is a **source MVP**, not a clinical care product and **not** production therapy.

> **Read [SAFETY.md](SAFETY.md) first.** SoulCap is not a replacement for professional mental health care. Crisis: call/text **988** (US) · text **HOME** to **741741**.

---

## Truth inventory (what runs)

| Surface | Path | Reality |
|---|---|---|
| Nest API | `backend/` | Full module source (LMM, orchestration, safety gate, panic, etc.). **Not deployed.** |
| Expo mobile | `mobile/` | Thin client: auth, chat, check-in. Points at local API. **Not store-ready.** |
| PWA demo | `docs/` | Installable UI shell. **localStorage only — not wired to Nest.** |

Feature bullets below describe **code present in-repo**, not a live clinical service.

---

## Architecture (source)

```
SoulCap/
├── backend/          # NestJS API + Prisma schema + safety gate
├── mobile/           # Expo (React Native) thin client
├── docs/             # PWA demo / gallery shell
├── icons/            # Cap Family brand pack
├── SAFETY.md         # Disclaimers + wired vs claimed
├── FEATURES.md       # S/W/L/R honesty matrix
└── VERSION.json      # 0.1.0
```

---

## Tech stack (intended)

| Layer | Technology |
|---|---|
| API | NestJS (TypeScript) |
| DB | PostgreSQL + pgvector (schema present) |
| Cache / jobs | Redis + BullMQ (source) |
| Models | Anthropic Claude / OpenAI Whisper (when keys configured) |
| Auth | Clerk webhook + password paths in source (incomplete deps — see SAFETY.md) |
| Mobile | React Native + Expo |
| PWA | Static `docs/` shell |

---

## Getting started (local)

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ with pgvector (for backend)
- Redis 7+ (for queues/cache)
- API keys only if exercising AI paths

### Backend

```bash
cd backend
cp .env.example .env
npm install   # may fail until missing auth deps are added — see SAFETY.md
npx prisma db push   # migrations folder not present yet
npm run start:dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

### PWA demo

Serve `docs/` as static files (e.g. GitHub Pages). No API required; data stays in the browser.

---

## Safety & ethics (summary)

- Not therapy, diagnosis, or crisis counseling
- Backend source includes keyword safety scan + hardcoded acute response text with crisis resources
- PWA shows Panic / 988 cues in UI; does not run the Nest safety gate
- Full clinical launch, validation study, and store release are **out of scope** for v0.1.0

Details: **[SAFETY.md](SAFETY.md)**

---

## License

MIT — see [LICENSE](LICENSE)
