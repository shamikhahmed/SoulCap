# SoulCap Evaluation Contract

**Version:** 1.8.0 · **Updated:** 2026-07-23

## Purpose

Evaluation protects reliability, safety, privacy, accessibility, and product honesty. Passing tests
does not establish clinical efficacy, therapeutic benefit, product-market fit, or medical-device
status.

## Release gates

1. JavaScript syntax check for every shipped script.
2. Playwright mobile and desktop suite (`npm run verify`) — currently **226** listed tests.
3. Safety suite for risk tiers, Help reachability, age gate, number-free routing, local-only voice,
   check-in tier-3 routing, and free-text tier-3 Help (journal / Your story at minimum).
4. Migration fixtures for prior state versions and forced persistence failure.
5. Zero unexpected external requests during representative journeys.
6. Version/cache/documentation consistency (`APP_VERSION`, `CACHE`, `VERSION.json`).
7. Human mobile, accessibility, copy, and visual checks listed in `ACCESSIBILITY.md`.

## Deterministic recommendation checks

- Each arrival word produces a meaningfully distinct top recommendation in the controlled fixture.
- Explicit arrival intent outranks ambient time.
- A saved direct need changes ranking only through declared family/domain mappings and appears in
  the explanation.
- Trauma caution remains a hard exclusion from automatic suggestions.
- Recent use reduces repetition; user helpful feedback is bounded and never becomes a score.

## Pattern checks

- Analysis starts only at five distinct check-in days.
- A pattern requires at least three distinct supporting days.
- Evidence can be traced to stable check-in IDs and dates.
- Rejected and hidden patterns do not return after reload.
- Confirming a pattern changes its trust label but does not claim causation.
- Turning pattern observations off prevents derivation without deleting source records.
- No pattern function reads journal bodies, profile prose, safety-plan prose, or Constellation notes.
- Confidence labels (Low / Medium / High) stay observational, never causal.

## Safety corpus

The keyword suite must include direct crisis wording, inflected forms, contextual combinations,
elevated distress, and benign figurative phrases (including `kms`). Both missed escalation and
over-triggering are safety failures. Keyword changes must be mirrored in the Nest lab service and
reviewed together.

## Library, daily-support, drip, and locale checks

- Article search works after the initial load with no external request.
- Every article carries review-status honesty, support guidance, source notes, and valid skill IDs.
- Sequential schema migration preserves prior data through v10.
- Current-day completion survives reload and no streak, score, badge, or reminder state exists.
- Failed choice or completion persistence restores the previous in-memory state visibly.
- Drip asks at most four questions per local day; estimates show confidence and are correctable;
  no estimate is presented as a diagnosis.
- Locale `rui` keeps `dir=ltr`; clinical/library/technique bodies remain English; chrome updates
  without requiring a network fetch.

## Synthetic-user limits

Persona journeys can identify interaction friction and likely perceptions, but software agents do
not feel and cannot replace human research. `USER_REVIEW.md` must distinguish observed behavior,
inferred perception, accepted risk, and unvalidated claim.

## Backend lab

`backend/` may host evaluation tooling, corpus experiments, or model-provider adapters, but it is
not part of the PWA runtime. Lab results must be reproducible, versioned, and clearly separated
from shipped claims. No backend score, model, or generated safety response may enter `docs/`
without a separate approved architecture and clinical-safety review.
