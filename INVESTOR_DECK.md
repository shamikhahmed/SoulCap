# SoulCap — Investor Deck

> **Product honesty (read first):** The live product (**v3.0.1** / schema v12) is an offline
> **self-guided wellness PWA** — deterministic suggestions, Guided Path (rule-based), keyword safety
> on free-text surfaces, and a private on-device journal. NestJS + model orchestration in `backend/`
> is **lab source only (not deployed)**. Do not pitch the Pages demo as AI, therapy, clinical care,
> or a crisis service. See `README.md` and `SAFETY.md`.

## Directional narrative (lab + raise framing)

**Category:** Offline self-guided wellness companion (deterministic PWA shipped; Nest/LMM lab)
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

**SoulCap's Living Mind Model is lab IP** — a dynamic psychological profile design. The shipped
PWA uses deterministic check-ins and context-fitted skills without pretending an LLM is online.

---

## The Solution: SoulCap

SoulCap ships a private, self-guided wellness PWA with guided skills, a searchable offline
emotional library, no-streak daily supports, a local journal, a relationship map, and on-device memory. Nest lab explores a **persistent psychological profile**
plus optional LLM orchestration — not marketed as live therapy AI on Pages.

> Think: deterministic, offline tools today; deeper personalisation only after models, evaluation,
> consent, security, and compliance are genuinely deployed.

**Three pillars:**

1. **Know You** — Local check-ins / journals on device; LMM design in Nest lab
2. **Support You** — Context-fitted skills, check-ins, journaling, and grounding exercises
3. **Help You Grow** — Optional daily supports + local history; no streak or engagement pressure

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

**Potential defensibility — not yet validated:**
- Trust from a strict offline product and precise, bounded claims
- A curated self-regulation library, safety constraints, and trauma-aware suggestion rules
- Future consented personalisation research in the undeployed lab
- No data network effect, clinician portal, or switching-cost claim is proven in the shipped PWA

---

## Safety Architecture: Built Right

Mental health software done wrong is dangerous. We built safety first.

**4-tier keyword kernel (repository/evaluation layer):**

| Tier | Trigger | Response |
|------|---------|----------|
| NONE | No keyword match | No classification action |
| DISTRESS | Reserved | Current kernel does not emit this tier |
| ELEVATED | Elevated phrases | Regression-tested classification only |
| ACUTE | Explicit or contextual phrases | Regression-tested classification only |

The shipped PWA has no chat surface and does not analyse private journal text. Help Now is a
separate, hard-coded interface reachable by the user from every screen.

**Help Now — one tap:**
- Slow paced-breathing visual
- Number-free guidance to reach someone trusted or local emergency services
- User-controlled shortcut to the device messaging app
- Help remains reachable from every screen

**Privacy reality:**
- PWA content stays in browser `localStorage`; no account, server, analytics, or remote model
- No raw content is transmitted or logged
- Device/browser storage encryption depends on the operating system; SoulCap adds no encryption
- PWA is not an EHR and makes no HIPAA compliance claim

> SoulCap is not therapy or a replacement for care. It is a private place to learn self-regulation
> skills, write, and notice what helps.

---

## Product — What We've Built

**Shipped PWA (`docs/` → GitHub Pages)**
- Deterministic Calm suggestions and 37 guided techniques
- Check-ins, Constellation, safety plan, and number-free Help
- v0.8 private journal book: templates, verified local transcription, photos, search, and contents
- `?demo=1` walkthrough seed

**Nest lab (not deployed)**
- NestJS + PostgreSQL/pgvector source modules
- Orchestration / LMM / safety gate designs
- Optional Claude / Whisper when keys exist locally

**Mobile lab:** React Native / Expo source — not the Pages product

**Roadmap, not shipped:**
Detailed check-ins · Trigger tracking · Explainable patterns · Emotional summaries ·
No-streak micro-habits · Urdu localisation · Optional encrypted backup · Native app

---

## Market Opportunity

**Total Addressable Market: $537B (Global Mental Health, 2030)**

**Serviceable Addressable Market:**
- Digital mental health apps: $88B by 2033
- US employer mental health benefits: $10B+ annually
- Telehealth platform integration: $50B+

**Our beachhead:** English-speaking, smartphone-owning adults aged 18–45 who seek mental health support but face access or cost barriers.

**Revenue hypotheses — unvalidated, not launched:**
1. **B2C** — optional paid backup/native features while core self-regulation remains useful free
2. **B2B wellness** — only after privacy, admin-boundary, and outcome validation
3. **Clinical distribution** — only as a separate reviewed product, never implied by the PWA

---

## Business Model

No billing, paid plan, enterprise admin, or pricing is shipped. Pricing above was removed because
it had not been tested with users. Next step: willingness-to-pay interviews and a privacy-safe
packaging experiment before publishing tiers.

### Unit Economics (Projections — Year 2)

| Metric | B2C | B2B |
|--------|-----|-----|
| CAC | $35 | $350 |
| Monthly Churn | 4% | <1% |
| LTV | $480 | $3,600 |
| LTV/CAC | 13.7x | 10.3x |

---

## Go-To-Market

**Phase 1: Validation (0–6 months)**
- Recruit a consented small beta; do not claim a waitlist that does not exist
- Influencer partnerships: mental health creators on TikTok/Instagram
- Clinician and lived-experience review of safety, copy, and techniques
- Launch message: "Private tools for hard moments — offline, on your device"

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
| **SoulCap** | **—** | Offline self-guided wellness PWA | Private journal + context-fitted skills; no account |

**Potential differentiation, still to validate:**
- Useful offline product with no account, analytics, or cloud dependency
- Explainable local personalisation that users can inspect and correct
- Safety behavior covered by deploy-gating tests
- Success measured by useful outcomes and reduced dependence, not time-in-app or a data flywheel

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

**Current capability shown in the repository:**
- Offline PWA product engineering and interaction design
- Safety-constrained rules and LLM orchestration lab architecture
- Automated browser, privacy, safety, and accessibility regression coverage

**Open team gaps:** licensed clinical review, formal privacy/compliance counsel, human-factors
research, distribution, and growth validation. No advisory board is claimed.

---

## Traction

**What's done:**
- Self-guided offline PWA live on GitHub Pages with deterministic suggestions
- User-invoked, number-free Help flow plus a regression-tested keyword kernel
- Nest/LMM lab source intact for future hosting
- Demo seed (`?demo=1`) for Cap Store walkthroughs

**What's next:**
- Validate the self-guided PWA with real users and licensed reviewers
- Only call features "AI" when a real LLM is deployed with keys + compliance
- Clinical validation before any care-adjacent claims

---

## Why Now

**Three forces aligning:**

1. **LLM capability** — Claude and GPT-4 class models are now good enough for safe, nuanced mental health dialogue
2. **Post-pandemic demand** — 2020–2024 permanently shifted awareness and demand for mental health tools
3. **Enterprise pressure** — Companies are legally and culturally mandated to provide mental health benefits

The opportunity is to validate whether private, self-guided wellness software can earn trust
without surveillance or care claims. That thesis is promising, not proven.

---

## The Opportunity

SoulCap is positioned to be the **emotional OS** for a generation that grew up with smartphones and is now navigating anxiety, burnout, and the need for human connection in a disconnected world.

**We are not building another mood tracker.**

We are building honest, offline wellness tools first; Nest lab remains a possible route to deeper
personalisation only if models, safeguards, and evaluation are actually shipped.

---

## Call to Action

**Join us in validating a private emotional operating system without pretending it is care.**

We are raising $2M at a $10M pre-money valuation.

**Contact:**
Shamikh Ahmed
shamikh73@gmail.com

---

*SoulCap. Know yourself. Grow yourself.*
