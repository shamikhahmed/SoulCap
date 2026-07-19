# SoulCap — Platform Presentation

> **Honesty (shipped product):** The live PWA at [`docs/`](./docs/) / GitHub Pages is a **Smart Companion** — rules-based reflections, keyword safety tiers, on-device journal. **Not** a live LLM. NestJS + model providers in `backend/` are a **lab only** (not deployed). See `README.md` + `SAFETY.md`.

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

**SoulCap** ships as an offline-first **clinical-path wellness PWA** with a **Smart Companion** (canned reflections + keyword safety rails). Architecture work toward a Living Mind Model lives in undeployed Nest lab source. **Not clinical care or production therapy.** See `SAFETY.md`.

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

**Shipped PWA today:** local check-ins, journals, habits, and Smart Companion replies — no live LMM or LLM.

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

**Shipped PWA:** keyword safety first; Smart Companion canned replies; Panic/988 resources.

---

## Slide 5: Safety First

SoulCap operates a **4-Tier Safety System**:

| Tier | Level | Response |
|------|-------|----------|
| 0 | NONE | Normal Smart Companion dialogue |
| 1 | DISTRESS | Gentle acknowledgment + resources offered |
| 2 | ELEVATED | Direct safety check-in + escalation prompt |
| 3 | ACUTE | **Hardcoded crisis response** — no model required; 988 / emergency contacts |

**Panic Mode** — One-tap crisis support:
- 5-4-3-2-1 grounding exercise
- Box breathing guide
- Safe place visualization
- Cold water reset
- Direct links to 988, Crisis Text Line, local emergency services

> SoulCap never claims to be a therapist. Never provides diagnosis. Always encourages professional help.

---

## Slide 6: Core Features

| Feature | Description |
|---------|-------------|
| **Smart Companion** | Rules-based reflections (PWA); Nest lab holds LLM orchestration source |
| **Daily Check-Ins** | Mood, energy, sleep tracking on-device |
| **Voice Notes** | Lab path: optional Whisper when keys exist — not required for PWA |
| **Journaling** | Local journals + clinician notes path |
| **Pattern Detection** | Lab direction; PWA keeps honest local history |
| **Weekly Insights** | Lab narrative reports — not fabricated in the PWA |
| **Goal / Habit Tracking** | On-device habits with simple streaks |
| **Intervention Tools** | Grounding flows in Panic mode |
| **Panic Mode** | Instant crisis support with grounding flows |

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
