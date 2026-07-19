# SoulCap — Investor Deck

> **Product honesty (read first):** Live GitHub Pages product is the **clinical-path PWA** — **Smart Companion** (rules-based), keyword safety, on-device journal. NestJS + Claude/OpenAI orchestration in `backend/` is **lab source only (not deployed)**. Do not pitch the Pages demo as a live LLM therapy product. See `README.md`, `CLINICAL.md`, `SAFETY.md`.

## Directional narrative (lab + raise framing)

**Category:** Clinical-path wellness companion (Smart Companion shipped; Nest/LMM lab)
**Stage:** Seed narrative · PWA MVP live
**Raise (aspirational doc):** $2,000,000
**Use of Funds:** Product hardening, compliance exploration, team, enterprise pilots

---

## The Problem is Massive and Personal

**500 million people** live with anxiety or depression globally.

Current solutions fail in three ways:

**1. Access**
- 6–18 week therapy waitlists
- $150–300/session average cost
- <10% of people who need mental health support ever receive adequate care

**2. Continuity**
- Therapy is 1 hour/week. Life is 24/7.
- Between sessions: no support, no memory, no connection
- Most people abandon apps within 3 days

**3. Personalization**
- Existing apps are identical for every user
- Generic CBT exercises don't account for individual psychology
- No app today builds a real understanding of who you are

---

## Our Insight: The Missing Layer

Every person has a unique psychological fingerprint.

Current apps ignore it. Therapists know it intuitively. A persistent profile can model it — carefully, with safety first.

**SoulCap's Living Mind Model is lab IP** — a dynamic psychological profile design. The shipped PWA supports personalized **Smart Companion** check-ins without pretending an LLM is online.

---

## The Solution: SoulCap

SoulCap ships an honest clinical-path companion with safety tiers and on-device memory. Nest lab explores a **persistent psychological profile** + optional LLM orchestration — not marketed as live therapy AI on Pages.

> Think: Smart Companion today; deeper Personalization when models are actually deployed with keys and compliance.

**Three pillars:**

1. **Know You** — Local check-ins / journals on device; LMM design in Nest lab
2. **Support You** — Smart Companion conversations, check-ins, journaling, grounding exercises
3. **Help You Grow** — Habits + local history; lab pattern/report engines not claimed as shipped AI

---

## The Living Mind Model (LMM) — Our Core IP

The LMM is what makes SoulCap defensible.

**What it tracks:**
- Emotional regulation capacity
- Resilience and recovery patterns
- Attachment style signals (secure, anxious, avoidant)
- Self-compassion and self-criticism levels
- Cognitive flexibility
- Trauma sensitivity indicators
- Help-seeking behavior
- Interpersonal trust
- 20+ additional clinical-adjacent traits

**How it works:**
- Every message, check-in, journal entry, and voice note updates traits
- Exponential Moving Average (α = 0.05) — recent events matter more
- Daily decay prevents frozen profiles
- Weekly snapshots capture real psychological change over time
- Semantic memory (pgvector) enables contextual recall across sessions

**Why it's defensible:**
- Data network effects — the longer a user is on SoulCap, the more personalized it becomes
- Switching cost: months of psychological modeling can't be replicated elsewhere
- Clinical co-design opportunity: therapists can subscribe to view LMM profiles of their patients

---

## Safety Architecture: Built Right

Mental health software done wrong is dangerous. We built safety first.

**4-Tier Safety System:**

| Tier | Trigger | Response |
|------|---------|----------|
| NONE | Normal conversation | Smart Companion dialogue |
| DISTRESS | Mild distress signals | Gentle check-in, resources offered |
| ELEVATED | Elevated risk signals | Direct safety assessment, escalation |
| ACUTE | Crisis signals | **Hardcoded response** (no model required) — 988, emergency contacts |

**Panic Mode — one tap:**
- 5-4-3-2-1 sensory grounding
- Box breathing
- Safe place visualization
- Crisis resources always accessible

**Privacy principles:**
- Message content encrypted at rest
- No raw content in logs
- Safety flags logged as signals only
- HIPAA-aligned architecture

> We are not a therapy replacement. We are what happens between therapy sessions — and for the people who can't access therapy at all.

---

## Product — What We've Built

**Shipped PWA (`docs/` → GitHub Pages)**
- Smart Companion chat (rules-based)
- Check-ins, journals, habits, Panic/988
- Clinician notes + local audit path
- `?demo=1` walkthrough seed

**Nest lab (not deployed)**
- NestJS + PostgreSQL/pgvector source modules
- Orchestration / LMM / safety gate designs
- Optional Claude / Whisper when keys exist locally

**Mobile lab:** React Native / Expo source — not the Pages product

**Full feature set:**
Conversations · Check-ins · Voice Notes · Journaling · Patterns · Insights · Growth Reports · Goals · Habits · Coping Mechanisms · Trigger Tracking · Activity Recommendations · Panic Mode · Push Notifications · Multi-tenant Orgs · Stripe Billing

---

## Market Opportunity

**Total Addressable Market: $537B (Global Mental Health, 2030)**

**Serviceable Addressable Market:**
- Digital mental health apps: $88B by 2033
- US employer mental health benefits: $10B+ annually
- Telehealth platform integration: $50B+

**Our beachhead:** English-speaking, smartphone-owning adults aged 18–45 who seek mental health support but face access or cost barriers.

**3 revenue channels:**
1. **B2C subscriptions** — Personal ($20/mo), Premium ($40/mo)
2. **B2B enterprise** — Per-seat license, employee wellness benefit
3. **B2B2C** — Healthcare systems, insurance, telehealth white-label

---

## Business Model

### B2C Tiers

| Plan | Price | Features |
|------|-------|---------|
| Free | $0 | 10 messages/week, basic check-ins |
| Personal | $19.99/mo | Unlimited chat, voice, journaling, LMM |
| Premium | $39.99/mo | All features + growth reports + priority AI |

### B2B

| Plan | Price | Notes |
|------|-------|-------|
| Team | $15/seat/mo | Up to 250 seats |
| Enterprise | $200–500/seat/yr | Custom integration, admin dashboard, analytics |

### Unit Economics (Projections — Year 2)

| Metric | B2C | B2B |
|--------|-----|-----|
| CAC | $35 | $350 |
| Monthly Churn | 4% | <1% |
| LTV | $480 | $3,600 |
| LTV/CAC | 13.7x | 10.3x |

---

## Go-To-Market

**Phase 1: Beta (0–6 months)**
- 500 waitlist users → closed beta
- Influencer partnerships: mental health creators on TikTok/Instagram
- Therapist referral program: "SoulCap between sessions"
- Launch PR: "The AI that remembers you"

**Phase 2: Growth (6–18 months)**
- Paid acquisition (Meta, TikTok, Google)
- SEO content: anxiety, depression, burnout keywords
- App Store Optimization
- Enterprise pilots: 3 companies, 500–2000 seats each

**Phase 3: Scale (18–36 months)**
- Healthcare system integration
- International expansion (UK, Canada, Australia)
- Clinical validation study
- Series A

---

## Competition

| Company | Valuation | What They Do | Gap |
|---------|-----------|-------------|-----|
| Calm | $2B | Meditation, sleep | No conversation, no memory |
| Headspace | $3B | Mindfulness, content | Static content, no personalization |
| BetterHelp | $4B | Async human therapy | Expensive, no AI, slow |
| Woebot | Private | CBT chatbot | Generic, no psychological profile |
| Wysa | Private | CBT chatbot | Generic, no memory |
| **SoulCap** | **—** | **AI with LMM** | **The only one that knows you** |

**Our moat:**
- Living Mind Model as persistent, proprietary data layer
- 10-step orchestration pipeline (not a simple chatbot)
- 4-tier safety system built to clinical standards
- Data flywheel: the longer users stay, the better it gets

---

## Financial Projections

|  | Year 1 | Year 2 | Year 3 |
|--|--------|--------|--------|
| Users | 5,000 | 50,000 | 250,000 |
| MRR | $50K | $750K | $4.5M |
| ARR | $600K | $9M | $54M |
| B2B Seats | 0 | 2,000 | 15,000 |
| Gross Margin | 72% | 78% | 82% |

*Projections assume $2M seed fully deployed within 12 months*

---

## Use of Funds — $2M Seed

| Category | Amount | Purpose |
|----------|--------|---------|
| Engineering | $700K | 2x senior engineers, 18 months |
| Clinical | $200K | Clinical advisor + validation study |
| Compliance | $150K | HIPAA audit + legal |
| Marketing | $500K | Launch + paid acquisition |
| Operations | $250K | Infra, tools, overhead |
| Reserve | $200K | Buffer |

**Key milestones unlocked:**
- 10,000 paid users
- 3 enterprise pilots signed
- HIPAA compliance completed
- Series A ready (targeting $10–15M)

---

## The Team

SoulCap was built by a team with deep expertise in:
- AI architecture and LLM orchestration
- Clinical psychology (advisory board)
- Privacy and healthcare compliance
- Consumer product and growth
- Full-stack engineering

---

## Traction

**What's done:**
- Clinical-path PWA live on GitHub Pages with honest Smart Companion
- 4-tier keyword safety + Panic resources
- Nest/LMM lab source intact for future hosting
- Demo seed (`?demo=1`) for Cap Store walkthroughs

**What's next:**
- Harden PWA / clinician path
- Only call features "AI" when a real LLM is deployed with keys + compliance
- Clinical validation before any care-adjacent claims

---

## Why Now

**Three forces aligning:**

1. **LLM capability** — Claude and GPT-4 class models are now good enough for safe, nuanced mental health dialogue
2. **Post-pandemic demand** — 2020–2024 permanently shifted awareness and demand for mental health tools
3. **Enterprise pressure** — Companies are legally and culturally mandated to provide mental health benefits

The window to build the definitive AI mental health platform is **now** — before a tech giant (Apple Health, Google, Microsoft) absorbs the market.

---

## The Opportunity

SoulCap is positioned to be the **emotional OS** for a generation that grew up with smartphones and is now navigating anxiety, burnout, and the need for human connection in a disconnected world.

**We are not building another mood tracker.**

We are building an honest wellness companion — Smart Companion on-device first; Nest lab for deeper personalization when we actually ship models.

---

## Call to Action

**Join us in building the mental health infrastructure for the next billion people.**

We are raising $2M at a $10M pre-money valuation.

**Contact:**
Shamikh Ahmed
shamikh73@gmail.com

---

*SoulCap. Know yourself. Grow yourself.*
