# SoulCap — Platform Presentation

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

**SoulCap** is a pre-production AI emotional wellness companion powered by a **Living Mind Model** architecture — a dynamic psychological profile designed to evolve with conversation. **Not clinical care or production therapy.** See `SAFETY.md`.

Not a chatbot. Not a mood tracker. A companion that grows with you.

---

## Slide 3: The Living Mind Model (LMM)

The core innovation: **a persistent psychological profile** that updates in real time.

**30+ tracked traits including:**
- Emotional regulation capacity
- Resilience and recovery speed
- Self-compassion levels
- Attachment style signals
- Cognitive flexibility
- Trauma sensitivity
- Help-seeking behavior

**How it works:**
- Every interaction updates traits via Exponential Moving Average (α = 0.05)
- Daily decay prevents stagnation
- Weekly snapshots capture growth over time
- The AI adapts its tone, strategy, and depth to your current psychological state

---

## Slide 4: The AI Orchestration Pipeline

Every message goes through **10 intelligent steps** before a response is generated:

1. **Quick Scan** — Intent and emotion detection
2. **Emotion Analysis** — Valence, arousal, dominant emotions (Claude Haiku)
3. **Safety Assessment** — 4-tier crisis detection
4. **LMM Retrieval** — Pull current psychological profile
5. **Memory Retrieval** — Semantic search of past conversations (pgvector)
6. **Strategy Selection** — CBT / DBT / ACT / Psychodynamic / Motivational
7. **Prompt Assembly** — Personalized context construction
8. **Model Routing** — Haiku for speed, Sonnet for depth
9. **Response Generation** — Contextually appropriate, emotionally intelligent
10. **Hard Rail Check** — Safety re-validation before delivery

---

## Slide 5: Safety First

SoulCap operates a **4-Tier Safety System**:

| Tier | Level | Response |
|------|-------|----------|
| 0 | NONE | Normal conversation |
| 1 | DISTRESS | Gentle acknowledgment + resources offered |
| 2 | ELEVATED | Direct safety check-in + escalation prompt |
| 3 | ACUTE | **LLM bypassed entirely** — hardcoded crisis response + immediate resource delivery |

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
| **AI Conversations** | Therapeutically-informed dialogue with memory and context |
| **Daily Check-Ins** | Valence, arousal, groundedness, energy tracking |
| **Voice Notes** | Whisper transcription → AI reflection |
| **Journaling** | Guided journaling with emotional state extraction |
| **Pattern Detection** | Automatic psychological pattern recognition |
| **Weekly Insights** | AI-synthesized observations about your growth |
| **Monthly Reports** | Narrative growth report with timeline |
| **Goal Tracking** | Goals with milestone detection and LMM updates |
| **Habit Tracking** | Streaks with psychological reinforcement |
| **Intervention Tools** | Coping mechanisms, triggers, activity recommendations |
| **Panic Mode** | Instant crisis support with grounding flows |

---

## Slide 7: Technical Architecture

**Backend:** NestJS (TypeScript) — production-grade, multi-tenant API

**Database:** PostgreSQL + pgvector — 65+ models, semantic memory search

**AI:** Claude Sonnet 4.6 + Haiku 4.5 — orchestrated pipeline

**Queue:** BullMQ — 15 async job queues for background processing

**Auth:** Clerk — enterprise-grade multi-tenant authentication

**Storage:** AWS S3 — encrypted media storage

**Mobile:** React Native + Expo — iOS & Android

**Privacy:** All message content encrypted. No raw content in logs. HIPAA-aligned design.

---

## Slide 8: The Market

**Global Mental Health Market: $537B by 2030**

- Digital mental health: fastest-growing segment ($17B → $88B by 2033)
- 3.8B smartphone users globally
- Gen Z: 42% report mental health conditions; most likely to seek app-based support
- Employer mental health benefits: $10B+ annual spend in the US alone

**SoulCap's addressable market:**
- B2C: Direct-to-consumer wellness subscribers
- B2B: Employee mental health benefits packages
- B2B2C: Healthcare systems, insurance, telehealth platforms

---

## Slide 9: Business Model

| Revenue Stream | Description | ARPU |
|---------------|-------------|------|
| **Personal** | Monthly subscription | $19.99/mo |
| **Premium** | Full access + voice + reports | $39.99/mo |
| **Enterprise** | Per-seat annual license | $200–500/seat/yr |
| **Healthcare** | System integration + white-label | Custom |

**Unit Economics (target):**
- CAC: $25–45 (B2C), $200–400 (B2B)
- LTV: $360–720 (12–18mo retention)
- LTV/CAC ratio: 8–15x

---

## Slide 10: Traction & Roadmap

**Current Status:**
- Full platform built: backend API, AI pipeline, mobile app
- Living Mind Model: deployed and validated
- Safety system: 4-tier with Tier 3 hardcoded bypass

**6-Month Roadmap:**
- Beta launch: 500 users
- Therapist co-pilot mode (session prep + between-session support)
- Group support features
- Clinical validation partnership

**12-Month Roadmap:**
- 50,000 active users
- Enterprise pilot: 3 companies
- ISO 27001 certification
- Series A raise

---

## Slide 11: Team

**Building at the intersection of AI, clinical psychology, and product.**

SoulCap was architected with input from:
- Staff-level software engineers
- AI/ML architects
- Clinical psychologists
- Privacy and compliance experts
- Database architects

---

## Slide 12: The Ask

**We are raising a $2M seed round** to:

- Launch beta and acquire first 10,000 users
- Complete HIPAA compliance audit
- Hire: Clinical Advisor, 2x Engineers, Growth Lead
- Enterprise pilot program
- Series A preparation

**In return:** You get in early on the platform that finally gets mental health personalization right.

---

> *"The mind is not static. Your wellness companion shouldn't be either."*
>
> — SoulCap

**Contact:** shamikh73@gmail.com
