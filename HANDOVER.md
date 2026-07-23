**Version:** 1.9.0 · SW `soulcap-v190`

# SoulCap — Project Handover

> **⚠️ This document below the divider is historical (v0.3.0).** Read this header block
> first — it is the current truth as of 2026-07-23. The sections further down describe an
> earlier architecture and are kept for reference only.

## Current state (v1.9.0 — 2026-07-23)

**The product is the PWA in `docs/`.** Offline-first, local-only, **no network calls after load** —
no account, no server, no LLM, no analytics. State lives in `localStorage` (schema **v10**).
Live: https://shamikhahmed.github.io/SoulCap/ · CI gates Pages on Playwright. Hub mirror:
`Cap-Apps/shamikhahmed.github.io/SoulCap/` · marketing shots `assets/screenshots/soulcap*.png` ·
in-repo gallery: `npm run gallery` → `screen-gallery.html`.

### What the PWA is now
- **Design System v2 “plum & sand”** — logo-anchored violet, low chroma. Themes: Auto / light /
  dark / **night** + Ocean / Forest / Rain / Space / Sunrise / Minimal / **AMOLED**. Accents:
  plum / lilac / mulberry / indigo. Text size, density, contrast, transparency. **v1.7 polish:**
  motion tokens, softer sheets/cards, deep dark surfaces, reduced-motion ≤80–90ms opacity-only.
- **Five tabs:** Now · Calm · Journal · People · You. **Settings sheet** off You (appearance,
  language, guided exercises, Constellation pace, data). Splash + welcome + 18+ onboarding.
- **37 techniques** with mechanisms, contraindications, capacity/needs, discreet flag,
  traumaCaution. Guided runner + paced breathing sessions. Spoken guidance local-only voices;
  auto-silent around people / panic; speaker toggle; exercise pace Slow/Steady/Brisk.
- **Calm** — guided “what do you need?” → context → fitted skills; browse-all; offline library
  (6 articles + **24 clinical experiences** physical/cognitive with red-flag panels); bookmarks;
  daily supports (no streaks).
- **Now** — greeting (late until 06:00), check-in (+ optional detail), adaptive drip (≤4/day),
  skill suggestion, optional message card, gentle reflection cards, reset menu entry from Calm.
- **Journal** — book UI, templates, photos (down-scaled; warn >20), search (mood/feeling/parked),
  Thought Parking, on-device speech only when verified local. Emotion vocabulary chips.
- **People (Constellation)** — SVG map, Still/Drift/Live pace, pinch rings 3–7, long-press rename,
  opt-in frequency sizing, person notes/events/ring history, safety-plan pull.
- **You** — profile, Your story, safety plan, journey, weekly summary, patterns with confidence,
  “What SoulCap knows”, Emotional Timeline, Principles, Personal Manual, Settings.
- **Locale** — `en` | `rui` (Roman Urdu LTR preview). Chrome partially localized; clinical /
  safety / technique / library bodies stay English until clinical-copy review. One dismissible
  clinical-English notice when `rui`.
- **Safety kernel** — keyword tiers 0–3 in `docs/app.js`, mirrored in Nest lab. Tier 3 opens
  hard-coded Help on check-in feeling **and** journal, Your story, safety plan, parked thoughts,
  person notes, manual lines, principles, reflection notes (content still saves when storage allows).
  No crisis phone numbers; `sms:` only for “Message someone.”

### Schema & ship
- State `DEFAULT.v = 10` · SW `soulcap-v190` · app **1.9.0** · mirrors: theme, appearance, locale,
  clinical-notice dismiss.
- Ship workflow: bump CACHE + VERSION.json + APP_VERSION together; CHANGELOG; SAFETY/HANDOVER;
  `npm run verify`; push `main`.

### Backend / mobile
`backend/` Nest lab (not deployed; PWA never calls it). `backend/_legacy/` quarantined — don’t
revive. `mobile/` Expo lab only.

### Tests & CI
~**226** Playwright checks (mobile + desktop Chromium; gallery gated by `CAPTURE_GALLERY=1`).
`.github/workflows/deploy.yml` runs `npm run verify` then deploys `docs/`.

### Open blockers (not code)
1. No clinician has signed off techniques/articles — banner stays.
2. Roman Urdu clinical-copy review not done — safety/clinical English stays.
3. Keyword kernel misses oblique risk — needs Kernel v2 / eval harness before any generative text.
4. Nest Prisma enums still lab-only; no production DB.

### For the next developer / AI agent
Read **`AGENTS.md`** then **`ROADMAP.md`**. `.cursorrules` is the short Cursor version. Vault notes:
`~/Capricorn-Brain/01 Projects/SoulCap-Therapy-App.md` and `AI/Claude-Code/SoulCap-*.md`.

---

<details>
<summary><b>Historical handover (v0.3.0) — earlier architecture, kept for reference</b></summary>

# SoulCap — Project Handover (v0.3.0, historical)

> **Shipped truth:** GitHub Pages deploys **`docs/`** (vanilla PWA). Companion replies are a **Smart Companion** (rules + keyword safety) — **not** a live LLM. NestJS in `backend/` and Expo in `mobile/` are **lab source only**. Cap Store demo: `?demo=1`.

**Last updated:** 2026-07-19  
**Status:** Clinical-path PWA live · Nest/Expo lab not deployed · Ready for `python3 -m http.server` in `docs/`

---

## Table of Contents

1. [What This Product Is](#1-what-this-product-is)
2. [What Has Been Built (Session Log)](#2-what-has-been-built)
3. [Architecture Overview](#3-architecture-overview)
4. [Codebase Map](#4-codebase-map)
5. [The Smart Companion / Nest Lab Spec](#5-the-ai-companion-behavioral-specification)
6. [The Living Mind Model](#6-the-living-mind-model)
7. [The Orchestration Loop (Core Intelligence)](#7-the-orchestration-loop)
8. [Database Schema](#8-database-schema)
9. [API Reference](#9-api-reference)
10. [Environment Setup](#10-environment-setup)
11. [Prioritized Backlog](#11-prioritized-backlog)
12. [Key Design Decisions](#12-key-design-decisions)
13. [Known Limitations & Technical Debt](#13-known-limitations--technical-debt)
14. [Critical Rules — Never Violate](#14-critical-rules--never-violate)

---

## 1. What This Product Is

**SoulCap** is a clinical-path wellness companion.

**Historical v0.3 PWA:** Smart Companion reflections, check-ins, journals, habits, safety tiers,
and clinician-note experiments — all on-device. Current v0.8 truth is in the header above.

**Lab (Nest / mobile):** Living Mind Model + LLM orchestration source for a future hosted API. Do not describe Pages demos as "AI therapy."

**It is NOT:**
- A therapy replacement
- A medical or diagnostic system
- A live LLM product on GitHub Pages
- A mood tracker with fake AI marketing

---

## 2. What Has Been Built

### Session 1 — Product Foundation
- Complete product foundation document (in conversation)
- Living Mind Model full design specification (in conversation)
- Architecture diagram (interactive HTML widget)

### Session 2 — Full MVP Implementation

**52 files created** across backend and mobile.

**Backend (NestJS):**
- Auth system (register, login, JWT)
- Prisma schema with 12 models
- Living Mind Model service (init, update, decay, belief management, phase detection)
- Memory Engine (episode storage, keyword retrieval, relationship graph)
- Belief Nodes service (inference, reinforcement, decay)
- Emotional Analysis service (Claude Haiku + tool_use structured extraction)
- Safety service (5-tier assessment, hard rails, crisis webhook)
- AI Orchestration service (10-step loop — see Section 7)
- Response Strategy service (mode + strategy selection logic)
- Intervention Engine service (effectiveness tracking)
- System Prompt builder (dynamic, personalized, LMM-injected)
- Conversation module (send message, session history, feedback)
- Check-In module (daily check-in, AI opener generation, LMM state update)

**Mobile (React Native/Expo):**
- Auth screen (login + register)
- Chat screen (session continuity, feedback buttons, crisis mode display)
- Check-In screen (valence slider, emotion chips, somatic awareness)
- Message component (role-aware, crisis badge, feedback)
- Zustand auth store
- API client with JWT interceptors

### Session 3 — AI Behavior Refinement + This Document
- System prompts fully rewritten to match AI behavioral specification
- Personalization block added to prompt (derives from LMM)
- Dynamic tone adjustment rules added
- "Never mention internal systems" hard rails enforced
- Golden Rule added as final constraint
- This HANDOVER.md created

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  iOS Client (React Native / Expo)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Chat Screen │  │ Check-In     │  │  Auth Screen         │  │
│  │  (main UX)   │  │ Screen       │  │  (JWT stored secure) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
└─────────┼─────────────────┼───────────────────────────────────  ┘
          │ REST API         │ REST API
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  NestJS Backend (port 3000)                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  AI ORCHESTRATION LAYER  (the core intelligence)        │   │
│  │                                                         │   │
│  │  Input → Emotional Analysis → Safety → LMM Retrieval   │   │
│  │       → Memory Retrieval → Strategy Selection          │   │
│  │       → Prompt Build → Response Gen → Model Update     │   │
│  └──────────────────────────────┬──────────────────────────┘   │
│                                 │                               │
│  ┌──────────────┐  ┌────────────┴────┐  ┌───────────────────┐  │
│  │ Living Mind  │  │  Memory Engine  │  │  Safety Service   │  │
│  │ Model Service│  │  (episodes,     │  │  (5-tier, hard    │  │
│  │              │  │  beliefs, rels) │  │  rails, webhook)  │  │
│  └──────────────┘  └─────────────────┘  └───────────────────┘  │
└────────────────────────────────────────────┬────────────────────┘
                                             │
          ┌──────────────────────────────────┴──────────────┐
          │                                                  │
          ▼                                                  ▼
┌─────────────────────┐                        ┌────────────────────┐
│  PostgreSQL         │                        │  Anthropic API     │
│                     │                        │                    │
│  users              │                        │  claude-sonnet-4-6 │
│  living_mind_models │                        │  (response gen)    │
│  belief_nodes       │                        │                    │
│  episodes           │                        │  claude-haiku-4-5  │
│  emotional_events   │                        │  (emotion analysis)│
│  relationship_nodes │                        │                    │
│  habits             │                        └────────────────────┘
│  goals              │
│  sessions           │
│  messages           │
│  intervention_recs  │
│  check_ins          │
└─────────────────────┘
```

---

## 4. Codebase Map

### Backend (`/backend/`)

```
backend/
├── .env.example              — environment variable template (copy to .env)
├── package.json              — dependencies
├── tsconfig.json             — TypeScript config
├── nest-cli.json             — NestJS CLI config
│
├── prisma/
│   └── schema.prisma         — FULL DATABASE SCHEMA (12 models, start here)
│
└── src/
    ├── main.ts               — Bootstrap: global pipes, CORS, Swagger, port
    ├── app.module.ts         — Root module, imports all feature modules
    │
    ├── prisma/
    │   ├── prisma.service.ts — PrismaClient wrapper (global, injected everywhere)
    │   └── prisma.module.ts  — Global module (no need to import per-module)
    │
    ├── common/
    │   ├── decorators/
    │   │   └── current-user.decorator.ts  — @CurrentUser() param decorator
    │   ├── guards/
    │   │   └── jwt-auth.guard.ts          — Applies JWT auth to routes
    │   └── filters/
    │       └── http-exception.filter.ts   — Global error handler
    │
    └── modules/
        │
        ├── auth/                         — Registration, login, JWT issuance
        │   ├── auth.service.ts           — register() hashes pw, creates user + LMM
        │   ├── auth.controller.ts        — POST /auth/register, POST /auth/login
        │   ├── auth.module.ts
        │   ├── dto/
        │   │   ├── register.dto.ts
        │   │   └── login.dto.ts
        │   └── strategies/
        │       └── jwt.strategy.ts       — Validates JWT, attaches user to request
        │
        ├── users/                        — User CRUD (thin service)
        │   ├── users.service.ts          — findById, findByEmail, updateProfile
        │   └── users.module.ts
        │
        ├── living-mind/                  — THE CORE USER REPRESENTATION
        │   ├── living-mind.types.ts      — All types: LmmSummary, BeliefDomain,
        │   │                               AIMode, ResponseStrategy, SafetySignals,
        │   │                               OrchestrationResult, EmotionalState
        │   ├── living-mind.service.ts    — initializeForUser, getModelSummary,
        │   │                               updateEmotionalState, updateFromInteraction,
        │   │                               addBeliefCandidate, reinforceBeliefNode,
        │   │                               userCorrectsBelief, runDecayForUser,
        │   │                               detectPhaseTransition
        │   └── living-mind.module.ts
        │
        ├── memory/                       — EPISODIC + SEMANTIC MEMORY
        │   ├── memory.types.ts           — StoreEpisodeInput, RetrievedMemory, RelationshipUpdate
        │   ├── memory.service.ts         — storeEpisode, retrieveRelevant (keyword v1),
        │   │                               getRecentEpisodes, getRelationshipGraph,
        │   │                               upsertRelationshipNode
        │   ├── belief-nodes.service.ts   — getDisplayEligible, getByDomain,
        │   │                               inferFromEmotionalEvent (pattern detection)
        │   └── memory.module.ts
        │
        ├── emotional-analysis/           — EMOTION DETECTION ENGINE
        │   ├── emotional-analysis.service.ts  — analyze(text) → EmotionalState + SafetySignals
        │   │                                    Uses Claude Haiku with tool_use
        │   │                                    Returns: valence, arousal, groundedness,
        │   │                                    dominantEmotions, intensity, safetySignals,
        │   │                                    mentionedRelationships, topics, keywords
        │   └── emotional-analysis.module.ts
        │
        ├── safety/                       — SAFETY FRAMEWORK
        │   ├── safety.service.ts         — assess(signals, rawMessage) → SafetyAssessment
        │   │                               Hard keyword scan (always runs, overrides AI)
        │   │                               5 tiers: 0=none, 1=distress, 2=elevated, 3=acute
        │   │                               buildTier3Response() — hardcoded crisis message
        │   │                               enforcesHardRails() — validates AI response
        │   └── safety.module.ts
        │
        ├── ai-orchestration/             — THE INTELLIGENCE LAYER (most critical)
        │   ├── prompts/
        │   │   └── system-prompts.ts     — buildSystemPrompt() — THE PROMPT BUILDER
        │   │                               Sections: IDENTITY, HARD_RAILS,
        │   │                               buildPersonalizationBlock (from LMM),
        │   │                               buildCurrentStateBlock,
        │   │                               buildBackgroundContextBlock,
        │   │                               buildMemoryBlock, MODE, STRATEGY,
        │   │                               RESPONSE_CONSTRAINTS + GOLDEN RULE
        │   ├── response-strategy.service.ts  — select() → { mode, strategy, rationale }
        │   │                                    Mode logic: safety > distress > keywords > default
        │   │                                    Strategy logic: state + mode + effectiveness history
        │   ├── intervention-engine.service.ts — recordIntervention, recordOutcome,
        │   │                                    estimateTrustLevel, buildEpisodeSummary
        │   ├── ai-orchestration.service.ts   — orchestrate() — THE 10-STEP LOOP
        │   └── ai-orchestration.module.ts
        │
        ├── conversation/                 — CHAT API
        │   ├── conversation.service.ts   — sendMessage (calls orchestrate),
        │   │                               getSessionHistory, getUserSessions,
        │   │                               recordFeedback (→ updates intervention effectiveness)
        │   ├── conversation.controller.ts — POST /conversations/message
        │   │                               GET /conversations/sessions
        │   │                               GET /conversations/sessions/:id
        │   │                               POST /conversations/messages/:id/feedback
        │   ├── conversation.module.ts
        │   └── dto/send-message.dto.ts
        │
        └── check-in/                     — DAILY CHECK-IN
            ├── check-in.service.ts       — submit (stores check-in + episode, updates LMM state,
            │                               generates AI opener), getHistory, getTodaysCheckIn
            ├── check-in.controller.ts    — POST /check-ins, GET /check-ins, GET /check-ins/today
            ├── check-in.module.ts
            └── dto/check-in.dto.ts
```

### Mobile (`/mobile/`)

```
mobile/
├── package.json
├── app.json              — Expo config (bundle ID, scheme, extra.apiUrl)
├── App.tsx               — Root: auth gate → tab navigator (Talk | Check In)
│
└── src/
    ├── api/
    │   └── client.ts     — Axios instance with JWT interceptor, authApi,
    │                       conversationApi, checkInApi
    ├── store/
    │   └── auth.store.ts — Zustand: login, register, logout, restoreSession
    ├── components/
    │   └── Message.tsx   — Chat bubble (user/assistant, crisis badge, feedback thumbs)
    └── screens/
        ├── AuthScreen.tsx    — Login/Register tab UI
        ├── ChatScreen.tsx    — Main conversation, session continuity
        └── CheckInScreen.tsx — Valence slider, emotion grid, somatic input
```

---

## 5. The AI Companion — Behavioral Specification

This is the canonical specification for how the AI must behave. All prompt engineering must conform to this. The implementation lives in `system-prompts.ts`.

### Primary Objective

At every interaction, the AI must:
1. Understand the user's current emotional state
2. Retrieve and use relevant memory naturally (never explicitly)
3. Identify patterns or risks (silently — never announce detection)
4. Choose the correct response strategy
5. Provide the most helpful response for: emotional stability, self-awareness, behavioral improvement
6. Update internal user understanding after response (silently, via the orchestration loop)

### Emotional Detection (internal, never announced)

Detect and respond to: stress, anxiety, sadness, anger, burnout, loneliness, emotional neutrality.
- Never assume 100% certainty
- Ask for confirmation if genuinely uncertain
- Never say "I've detected X" — just respond appropriately

### Memory Usage Rules

Before responding, the system considers: past emotional events, recurring triggers, relationship dynamics, habits, known coping strategies, past successful interventions.

- Only surface what's relevant to this moment
- Never recite memory ("last time you said…")
- Let understanding show through the quality of the response, not through announcing what you remember
- NEVER use the words "memory", "model", "engine", "system", "data", "history", "profile" to the user

### Pattern Detection (internal, never announced)

The system continuously looks for: repeated emotional cycles, behavioral triggers, environmental triggers, relationship-based stress patterns, habit-emotion correlations.

Surface a pattern to the user ONLY when:
- Confidence is high (> 0.65)
- It would genuinely serve the user in this moment
- The relationship has enough trust
- Frame as: "I've been noticing something…" (PATTERN strategy)

### The Four Modes

| Mode | When to Use | Core Goal |
|------|-------------|-----------|
| **Support** | High distress, negative valence, first turn | Feel genuinely heard |
| **Coaching** | User is stable, guidance-seeking language | Forward momentum |
| **Reflection** | User is confused/circling, self-inquiry language | See themselves more clearly |
| **Crisis** | Safety signals, acute distress | Safety, calm, resources |

Selection logic: Safety override → distress level → user message keywords → relationship stage → default Support.

### Communication Style — Dynamic Tone Adjustment

| User State | Tone Adjustment |
|-----------|-----------------|
| Anxious | Slow, grounding, shorter sentences |
| Sad | Soft, validating, no silver linings yet |
| Stable | Slightly more proactive, can be direct |
| Motivated | Structured, action-oriented |
| In crisis | Simple, short, human, no complex reasoning |

### Absolute Rules (Hard Rails)

1. Never claim to be a therapist
2. Never provide clinical diagnosis
3. Never use clinical labels on the person
4. Never give medical/psychiatric/pharmacological advice
5. Never discourage professional help
6. If crisis signals present: provide resources + ask about safety
7. Never mention internal systems to the user
8. Never say "memory", "model", "engine", "system" to the user
9. Two people must never receive identical responses
10. Never start with "I understand", "I hear you", "That sounds…"

### The Golden Rule

> You are not trying to respond well. You are trying to help this person become emotionally more stable and self-aware over time. A response that makes them feel good right now but keeps them stuck is a failure. A response that is slightly uncomfortable but genuinely moves them forward is a success.

### Personalization Adaptation

Based on LMM data, the AI adapts:
- **Attachment style** → how much space to give, how consistent to be
- **Emotional volatility** → how fixed to be in interpretations
- **Locus of control** → how to frame agency and responsibility
- **Emotional granularity** → vocabulary complexity for emotions
- **Intervention effectiveness history** → what strategies to use or avoid
- **Relationship stage** (based on interaction count) → how much to surface vs. just listen

---

## 6. The Living Mind Model

The LMM is the product's core asset. Every feature must either read from it or write to it.

### Four Layers

| Layer | Update Freq | Decay Rate | Contents |
|-------|-------------|------------|----------|
| **Surface** | Every session | 3–14 days | Current emotional state, active stressors, recent events |
| **Pattern** | Weekly aggregation | 4–12 weeks | Triggers, coping repertoire, behavioral cycles, communication patterns |
| **Core** | Monthly review | 6–24 months | Values, core beliefs, attachment style, narrative identity |
| **Trajectory** | Longitudinal | Anchored | Growth arc, phase transitions, intervention response map |

### Belief Node Structure

Every piece of knowledge about a user is a `BeliefNode`:
```
domain → subdomain → claim
confidence (0.0–1.0)
provenanceType (EXPLICIT | INFERRED | CORROBORATED | HYPOTHESIZED)
episodeCount
halfLifeDays (differential by layer)
currentWeight (confidence × decay factor)
revisionHistory []
supportingEpisodes []
displayEligible (confidence ≥ displayThreshold)
```

### LMM Update Triggers

- Every conversation → `updateFromInteraction()` (emotional state + strategy effectiveness)
- Every check-in → `updateEmotionalState()`
- Pattern detected after 3+ corroborating episodes → `addBeliefCandidate()`
- User corrects the model → `userCorrectsBelief()` (confidence -= 0.25)
- Daily cron (planned) → `runDecayForUser()`

### Phase Transition Detection

If 3+ Core/Cognitive/Relational beliefs shift by >0.2 confidence within 30 days → phase transition flagged. This is the most significant model event. Current state: logic exists in `detectPhaseTransition()`, cron trigger not yet built.

---

## 7. The Orchestration Loop

**File:** `ai-orchestration.service.ts` → `orchestrate()`

This is called for EVERY user message. All 10 steps run sequentially.

```
Step 1: Emotional Analysis
        EmotionalAnalysisService.analyze(userMessage)
        → Claude Haiku + tool_use → structured: valence, arousal, groundedness,
          dominantEmotions, intensity, safetySignals, mentionedRelationships,
          topics, keywords

Step 2: Safety Assessment (ALWAYS before anything else)
        SafetyService.assess(safetySignals, rawMessage)
        → Keyword scan runs first (overrides AI tier if higher)
        → Returns: tier (0-3), requiresModeOverride, protocolResponse

Step 3: LMM Context Retrieval
        LivingMindService.getModelSummary(userId)
        → Pulls top belief nodes, current state, active goals/triggers/risks,
          intervention effectiveness map

Step 4: Memory Retrieval
        MemoryService.retrieveRelevant() + getRecentEpisodes()
        → Merged, deduplicated, max 5 memories
        → v1: keyword + emotion matching + salience scoring
        → v2 planned: pgvector semantic search

Step 5: Strategy Selection
        ResponseStrategyService.select()
        → Safety override checked first
        → Mode: SUPPORT / COACHING / REFLECTION / CRISIS
        → Strategy: WITNESS / REFLECT / EXPLORE / PATTERN / etc.

Step 6: Tier-3 Check
        If safety tier === 3 → return hardcoded crisis response immediately
        → Skip Steps 7-8, go straight to Step 9

Step 7: System Prompt Build
        buildSystemPrompt({ lmm, memories, mode, strategy, turnCount })
        → Dynamic sections: identity, hard rails, personalization (from LMM),
          current state, background context, memory, mode, strategy, constraints + golden rule

Step 8: Response Generation
        Claude Sonnet + system prompt + session history (last 10 messages)
        → max_tokens: 600

Step 9: Hard Rail Check
        SafetyService.enforcesHardRails(aiResponse)
        → Checks for therapist-claim, clinical diagnosis language
        → Logs warning if violated (future: auto-regenerate)

Step 10: Post-Interaction Updates (async, fire-and-forget)
         → storeEpisode() (creates episode record with summary)
         → updateFromInteraction() (LMM baseline update, effectiveness tracking)
         → recordIntervention() (logs what was tried)
         → inferFromEmotionalEvent() (checks if emotion frequency triggers new belief candidate)
```

### Response Shape

```typescript
{
  content: string,
  mode: AIMode,
  strategy: ResponseStrategy,
  safetyTier: number,
  explainability: {
    detectedEmotions: EmotionalState,
    selectedMode: AIMode,
    selectedStrategy: ResponseStrategy,
    modeRationale: string,
    strategyRationale: string,
    memoriesUsed: number,
    modelConfidence: number,
  }
}
```

Every response is explainable. The `explainability` object is stored on every `Message` record.

---

## 8. Database Schema

Full schema: `backend/prisma/schema.prisma`

| Table | Purpose | Key fields |
|-------|---------|------------|
| `users` | Auth | email, passwordHash, displayName, timezone |
| `living_mind_models` | Core LMM (1:1 with user) | baselineHedonic, emotionalVolatility, emotionalGranularity, attachmentStyle, currentEmotionalState (JSON), activeRisks/Goals/Triggers (JSON), interventionEffectiveness (JSON) |
| `belief_nodes` | Individual beliefs | domain (enum), subdomain, claim, confidence, provenanceType, halfLifeDays, currentWeight, revisionHistory (JSON), supportingEpisodes (String[]) |
| `episodes` | Episodic memory | contentSummary, topics[], keywords[], emotionalValence, dominantEmotions[], emotionalSalience, embeddingJson (future pgvector) |
| `emotional_events` | Individual emotion records | emotionType, valence, arousal, intensity, trigger, source |
| `relationship_nodes` | People in user's life | label, category, salience, valence, supportCapacity, drainCapacity, mentionFrequency (JSON) |
| `habits` | Habit tracking | name, category, targetFrequency, currentAdherence, emotionalCorrelation (JSON) |
| `goals` | Goal tracking | description, domain, status (enum), progress, blockers[] |
| `sessions` | Conversation sessions | mode (enum), qualityScore, startedAt, endedAt |
| `messages` | Individual messages | role, content, aiMode, strategyUsed, explainability (JSON), safetyTier |
| `intervention_records` | What was tried + outcome | strategy, contextEmotionalState (JSON), immediateEngagement, userFeedback, overallScore |
| `check_ins` | Daily check-ins | valence, arousal, groundedness, emotions[], energyLevel, freeText, aiInsight |

---

## 9. API Reference

Base path: `http://localhost:3000/api/v1`
Swagger UI: `http://localhost:3000/docs`
Auth: Bearer JWT on all routes except `/auth/*`

### Auth
| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/auth/register` | `{ email, password, displayName? }` | `{ access_token, user }` |
| POST | `/auth/login` | `{ email, password }` | `{ access_token, user }` |

### Conversation (requires JWT)
| Method | Path | Body/Params | Response |
|--------|------|-------------|----------|
| POST | `/conversations/message` | `{ message, sessionId? }` | `{ sessionId, messageId, content, mode, strategy, safetyTier }` |
| GET | `/conversations/sessions` | `?page=1` | `{ sessions[], total, page }` |
| GET | `/conversations/sessions/:id` | — | `{ session + messages[] }` |
| POST | `/conversations/messages/:id/feedback` | `{ feedback: positive|neutral|negative }` | `{ recorded: true }` |

### Check-In (requires JWT)
| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/check-ins` | `{ valence, arousal, groundedness, emotions?, energyLevel?, freeText? }` | `{ checkInId, aiOpener }` |
| GET | `/check-ins` | `?limit=30` | `CheckIn[]` |
| GET | `/check-ins/today` | — | `CheckIn | null` |

---

## 10. Environment Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (local or cloud — Neon.tech recommended)
- Anthropic API key

### Backend
```bash
cd backend
cp .env.example .env
# Fill in:
#   DATABASE_URL=postgresql://user:pass@host:5432/living_mind
#   JWT_SECRET=minimum-32-char-random-string
#   ANTHROPIC_API_KEY=sk-ant-...

npm install
npm run prisma:push        # creates all tables
npm run start:dev          # http://localhost:3000
```

### Mobile
```bash
cd mobile
npm install

# Set API URL in mobile/app.json extra.apiUrl
# Default: http://localhost:3000

npx expo start --ios
```

### Vercel Deployment (backend)
The NestJS backend can deploy to Vercel as a serverless function using `@vercel/node`. 
Alternatively deploy to Railway or Render for a persistent Node.js process (preferred for NestJS).

---

## 11. Prioritized Backlog

### P0 — Required for production readiness
- [ ] pgvector semantic memory search (replace keyword matching in `memory.service.ts`)
- [ ] Encryption at rest for `message.content` and `episode.contentSummary`
- [ ] Decay cron job (daily `runDecayForUser` for all users)
- [ ] Phase transition detection trigger (currently logic exists, no trigger)
- [ ] Rate limiting (express-rate-limit or NestJS throttler)
- [ ] Input sanitization for AI injection (prevent prompt injection via user messages)

### P1 — Core product completeness
- [ ] LMM dashboard screen (mobile) — show user their belief nodes, emotional history, patterns
- [ ] Habit tracking endpoints + check-in integration
- [ ] Goal tracking endpoints
- [ ] Push notifications for daily check-in reminders
- [ ] Belief node correction UI (user can edit what the model believes)
- [ ] Monthly growth letter generation (narrative AI summary of the past month)
- [ ] Session end detection + quality scoring

### P2 — Product depth
- [ ] Voice input/output (check-in + conversation)
- [ ] Relationship graph visualization
- [ ] Panic mode UI (one-tap crisis mode with immediate grounding)
- [ ] Annual growth narrative (birthday feature)
- [ ] Model export (user data portability)
- [ ] Onboarding flow (structured first-session questions)
- [ ] Cross-session pattern surfacing (AI proactively surfaces patterns between sessions)

### P3 — Scale + partnerships
- [ ] Professional bridge (therapist API with consent-based model sharing)
- [ ] Habit-emotion correlation intelligence (advanced analytics)
- [ ] Biometric integration (Apple Health / wearable)
- [ ] Multi-language support

---

## 12. Key Design Decisions

### Why NestJS over Hono/Express?
Modularity and DI. This system is intentionally modular — each engine (emotional analysis, safety, memory, LMM) must be independently testable. NestJS's module system enforces this.

### Why Claude Haiku for emotional analysis?
Speed and cost. Analysis happens on every message before generation. Using a fast, cheap model for the analysis step and the primary model only for generation keeps latency acceptable and cost manageable.

### Why keyword retrieval instead of vector search in v1?
Pragmatism. pgvector works in PostgreSQL but requires the extension enabled and embedding generation per episode. v1 ships faster with keyword + emotion + salience scoring. Vector search is v2. The memory retrieval interface is clean enough that the swap won't break anything.

### Why store explainability on every message?
Accountability. Every AI response must be traceable: what emotional state was detected, what strategy was chosen, why. This enables: debugging, safety audits, clinical partnerships, user trust features ("why did it say that?").

### Why LMM initialized at registration?
Cold start UX. An empty model gives no value. Initializing with sensible defaults (0 baseline hedonic, 0.5 volatility, "unknown" attachment) means the first session has a model to update rather than a model to create.

### Why logarithmic belief reinforcement?
Psychological accuracy. The first corroboration of a belief is high-signal; the 20th is low-signal. Linear confidence growth would produce over-confident models. Logarithmic reinforcement matches how beliefs actually form.

### Why hardcode the Tier-3 crisis response?
Safety. A dynamically generated response to "I want to kill myself" is never acceptable even if the AI is excellent. The Tier-3 response is written by a human, reviewed for safety, and never bypassed by the LLM. The LLM does nothing in Tier-3 except stay out of the way.

---

## 13. Known Limitations & Technical Debt

| Item | Severity | Note |
|------|----------|------|
| No message content encryption | High | `message.content` and `episode.contentSummary` stored in plaintext. Must encrypt before any real user data. |
| Keyword memory retrieval | Medium | Will miss semantically relevant memories without exact keyword overlap. pgvector upgrade is critical for product quality. |
| No decay cron job | Medium | Belief nodes never decay without a scheduled job. Model becomes stale over time. |
| Hard rail violation not auto-corrected | Medium | If AI response violates hard rail, it's logged but still returned. Should re-generate with stricter prompt. |
| No input sanitization for prompt injection | Medium | User messages injected directly into system prompt via memory. Sanitize before injection. |
| Mobile has no offline support | Low | No local caching. If API is down, nothing works. |
| Session quality score never computed | Low | `sessions.qualityScore` is set but never populated. |
| `EpisodeType.VOICE_SESSION` defined but not used | Low | Voice is planned but not built. |
| No test suite | High | Zero tests. Every module should have unit tests. Integration tests for orchestration loop are critical. |

---

## 14. Critical Rules — Never Violate

These are the invariants of the system. Violating them breaks the product contract.

**1. Every user interaction passes through the AI Orchestration Layer.**
There is no shortcut route. No module generates an AI response without going through `AiOrchestrationService.orchestrate()`.

**2. Every AI response is explainable.**
The `explainability` object must be populated on every `Message` record. Remove it only if you're removing the transparency feature, which you are not.

**3. Safety check always runs first, before LMM retrieval, before generation.**
The order of steps in `orchestrate()` is not arbitrary. Safety is Step 2 regardless of performance cost.

**4. The Living Mind Model is updated after every interaction.**
No interaction is allowed to leave the model untouched. The model is only as good as its data. `updateFromInteraction()` must be called in `postInteractionUpdate()`.

**5. Memory is never recited — only used.**
The AI must never say "last time you mentioned…" or "I remember you said…". Memory informs the response; it never becomes the response.

**6. The AI never claims to be a therapist or make a clinical diagnosis.**
This is both an ethical and legal hard line. The hard rail check in `SafetyService.enforcesHardRails()` must remain and must be expanded as needed.

**7. Never use the words memory, model, engine, or system in AI responses to users.**
This is in the hard rails. The AI is a companion, not a system reporting on itself.

**8. The Living Mind Model schema is the source of truth for user state.**
No service should maintain its own parallel representation of user state. Everything goes through the LMM.

---

---

## 15. Architectural Review Findings (2026-06-14)

A full panel review was conducted (Staff Engineers, AI Architect, Clinical Psychologist, Privacy Expert, DB Architect). The system architecture is sound; the following specific bugs and gaps were identified. All must be resolved before any real user data enters the system.

### CRITICAL Bugs (broken today, silent failures)

| ID | File | Issue |
|----|------|-------|
| L1 | `living-mind.service.ts:275` | Phase transition detection uses `'CORE'` which is not a valid `BeliefDomain` enum. Returns zero results silently. Phase transitions can never be detected. Fix: replace `'CORE'` with valid domains. |
| L2 | All services | `EmotionalEvent` records are never created anywhere. `getEmotionFrequency` always returns 0. Belief node inference pipeline never triggers. Core LMM learning mechanism is broken. |
| S1 | `emotional-analysis.service.ts:158` | Fallback on Haiku API failure returns `tier: 0`. AI safety signals are silently suppressed on any API error. Fix: fallback must emit `tier: 1`. |
| S2 | `ai-orchestration.service.ts:142` | Hard rail violations are logged but the violating response is still returned to the user. Fix: auto-regenerate with override instruction; hardcoded fallback on second failure. |
| P1 | `schema.prisma` | `message.content`, `episode.contentSummary`, and all LMM JSONB fields stored in plaintext. Must encrypt at application layer before any real user data. |

### HIGH Bugs / Gaps

| ID | Issue |
|----|-------|
| S3 | Historical proposal to inject a country-specific number. Rejected; current Help is number-free and country-agnostic. |
| S4 | Crisis keyword list has false positives ("giving away", "farewell") that trigger on non-crisis messages. Split into unambiguous vs. contextual keyword lists. |
| S7 | Keyword scan runs after Haiku API call (Step 2 after Step 1). Move keyword scan to t=0 before any API call. |
| L3 | Decay updates `currentWeight` but not `confidence`. Reinforcement increments use `confidence` — creates wrong math after decay. |
| L4 | Belief deduplication on `domain+subdomain` only. Two different claims in same subdomain get merged. Dedup on `domain+subdomain+claim-hash`. |
| L5 | `emotionalGranularity`, `metacognitiveAwareness`, `locusOfControl`, `attachmentStyle` all initialized but never updated by any code. The system's primary personalization dimensions are permanently frozen at defaults. |
| L6 | Intervention effectiveness matrix only updates on explicit user thumbs feedback. Almost never updates. Implement implicit scoring from next-message valence delta. |
| A2 | Memory retrieval hard-caps at 50 episodes. Users with long history cannot surface old memories. Cap should be dynamic (`Math.max(50, episodeCount * 0.2)`). |
| P3 | No JWT refresh token or revocation mechanism. Compromised tokens cannot be invalidated. |
| P4 | No user deletion endpoint. No right-to-erasure compliance (GDPR Article 17). |
| PS1 | Mode selection ignores `attachmentStyle`. Avoidant users in neutral state get REFLECTION, which triggers avoidance. |
| PS2 | Strategy selection uses `Math.random()`. Not reproducible, not auditable, not testable. Replace with deterministic readiness scores. |
| A5 | Rapid concurrent messages cause read-modify-write race on LMM row. Use BullMQ queue per userId for LMM updates. |

### MEDIUM Gaps

| ID | Issue |
|----|-------|
| L7 | `confidenceScore` is avg across all belief nodes. A model with 40 low-confidence hypotheses scores lower than one with 3 explicit beliefs — wrong direction. Weight by provenance type. |
| L8 | `userCorrectsBelief` sets `userValidated: true` on a rejection. Add `userRejected` field. |
| L9 | EMA alpha=0.05 too slow. Baseline starts at 0 regardless of actual user state. Adaptive alpha + cold-start from first check-in. |
| L10 | Check-in submissions don't trigger belief inference. Check-in is high-signal longitudinal data being wasted. |
| PS4 | Early-session default overrides explicit coaching requests. New users asking for coaching get SUPPORT. |
| A1 | Orchestration is fully sequential. Steps 1a (Haiku) + 1b (LMM) + 1c (Memory) can all run in parallel. Save ~1-2s per message. |
| A3 | `runDecayForUser` runs N concurrent UPDATE statements. Replace with single bulk SQL UPDATE. |
| A4 | Two Anthropic clients instantiated (EmotionalAnalysis + Orchestration). Consolidate to shared AnthropicProvider. |
| A7 | No idempotency key on message endpoint. Network retries create duplicate messages and double LMM updates. |
| P2 | RelationshipNode stores psychological profile of third parties without their consent. Design decision required. |
| P5 | No consent architecture for LMM profiling. Onboarding must capture explicit consent for inference storage. |
| D2 | `Session.mode` set at start and never updated. Mode changes mid-session are not reflected in session record. |

### Revised Implementation Order

**Week 1 — Fix Silent Failures:** L1, L2, S2, S1, L8 (phase enum, emotional events, auto-regenerate, fail-secure fallback, correction semantics)

**Week 2 — Safety and Privacy:** S4, S7, S3, P3, P4, P1 (keyword split, early scan, Tier-2 resources, JWT refresh, user deletion, encryption)

**Week 3 — LMM Correctness:** L3, L4, L6, L5, L9, L10, PS1, PS2 (decay/reinforce fix, dedup fix, implicit scoring, trait updates, EMA fix, check-in inference, attachment mode, deterministic strategy)

**Week 4 — Architecture Hardening:** A1, A2, A4, A5, A3, A7, P5 (parallel orchestration, dynamic memory cap, shared client, BullMQ queue, bulk decay, idempotency, consent flow)

---

*This document was last updated in Session 4 (2026-06-14) — full architectural review completed.*
*Next update due: after Week 1 fixes land.*
*Owner: update this document whenever you change architecture, add a module, or complete a backlog item.*

</details>
