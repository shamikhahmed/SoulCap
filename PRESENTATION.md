# SoulCap — Platform Presentation

> **Honesty (shipped product · v2.1.0):** The live PWA at [`docs/`](./docs/) / GitHub Pages is a
> private, self-guided wellness tool: deterministic suggestions, Guided Path, guided skills, journal,
> Constellation, Personal Manual, and keyword safety on free-text surfaces. It has no chat surface
> or live LLM. NestJS + model providers in `backend/` are an undeployed lab. See `README.md` +
> `SAFETY.md`.

---

## Slide 1: The Problem

**1 in 4 people** will experience a mental health condition this year.

- Therapy wait times: **6–18 weeks** in most countries
- Average therapy session: **$150–$300**
- Most people quit after **2–3 sessions** due to cost or time
- Mental health apps today: **generic, impersonal, forgettable**

> People don't need another mood tracker. They need something that truly knows them.

---

## Slide 2: Introducing SoulCap

**SoulCap** ships as an offline-first, self-guided wellness PWA with context-fitted skills, a
private journal book, and a relationship map. Architecture work toward a Living Mind Model lives
in undeployed Nest lab source. **Not clinical care or therapy.** See `SAFETY.md`.

Not a chatbot pretending to be a therapist. A companion shell that stays honest about what runs on-device today.

---

## Slide 3: The Living Mind Model (LMM) — Lab Direction

**Lab IP (Nest source):** a persistent psychological profile design intended to update with interaction.

**30+ tracked traits including:**
- Emotional regulation capacity
- Resilience and recovery speed
- Self-compassion levels
- Attachment style signals
- Cognitive flexibility
- Trauma sensitivity
- Help-seeking behavior

**How the lab design works:**
- Trait updates via Exponential Moving Average (α = 0.05)
- Daily decay prevents stagnation
- Weekly snapshots capture growth over time
- A future orchestration layer would adapt tone/strategy from that profile

**Shipped PWA today:** local check-ins, a full private journal book, guided techniques, and
deterministic personalisation — no live LMM or LLM.

---

## Slide 4: Orchestration Pipeline (Nest Lab)

Every Nest-lab message path is designed to go through **10 steps** before a model response (not live on Pages):

1. **Quick Scan** — Intent and emotion detection
2. **Emotion Analysis** — Valence, arousal, dominant emotions (Haiku when keys present)
3. **Safety Assessment** — 4-tier crisis detection
4. **LMM Retrieval** — Pull current psychological profile
5. **Memory Retrieval** — Semantic search of past conversations (pgvector)
6. **Strategy Selection** — CBT / DBT / ACT / Psychodynamic / Motivational
7. **Prompt Assembly** — Personalized context construction
8. **Model Routing** — Haiku for speed, Sonnet for depth
9. **Response Generation** — Contextually appropriate reply
10. **Hard Rail Check** — Safety re-validation before delivery

**Shipped PWA:** keyword safety first, deterministic suggestions, and number-free Help guidance.

---

## Slide 5: Safety First

The repository keeps a **4-tier keyword kernel** for regression tests and future evaluated work.
The current PWA has no chat input and does not run private journal text through this detector.

| Tier | Level | Response |
|------|-------|----------|
| 0 | NONE | No keyword match |
| 1 | DISTRESS | Reserved; current kernel does not emit this tier |
| 2 | ELEVATED | Regression-tested classification only |
| 3 | ACUTE | Regression-tested classification only; no generated response |

**Help Now** — One-tap, hard-coded support:
- A slow paced-breathing visual
- A reminder that there is nothing to get right
- A user-controlled shortcut to their own messaging app
- Number-free guidance to reach someone trusted or local emergency services

> SoulCap never claims to be a therapist. Never provides diagnosis. Always encourages professional help.

---

## Slide 6: Core Features

| Feature | Description |
|---------|-------------|
| **Context-fitted suggestions** | Deterministic skill choices based on check-ins and user context |
| **Daily Check-Ins** | One-tap emotional check-ins stored on-device |
| **Voice Journal** | Transcription only when the browser verifies on-device processing; no cloud fallback |
| **Journaling** | Private local book with templates, photos, search, month contents, and decoration |
| **Pattern Detection** | Lab direction; PWA keeps honest local history |
| **Weekly Insights** | Lab narrative reports — not fabricated in the PWA |
| **Micro-habits** | Planned without streaks, scores, or guilt mechanics |
| **Intervention Tools** | Grounding and breathing flows in Help |
| **Help Now** | Immediate grounding and number-free reach-out guidance; not a crisis service |

---

## Slide 7: Technical Architecture

**Shipped:** vanilla JS PWA in `docs/` — localStorage, Service Worker, keyword safety.

**Lab (not deployed):** NestJS + PostgreSQL/pgvector + optional Claude/OpenAI keys — see `backend/`.

**Mobile lab:** React Native / Expo source in `mobile/` — not the Pages demo.

---

## Slide 8: What We Are Not Claiming

- Not a medical device
- Not licensed therapy
- Not a substitute for crisis counseling
- Nest + LLM stack = **lab**, not production SaaS on GitHub Pages

---

## Closing

> *"Safety gates first. Honest companion language second. Models only when we actually ship them."*
