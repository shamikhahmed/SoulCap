# SoulCap — Features (S/W/L/R)

**Updated:** 2026-07-23 · Self-guided wellness companion · **v3.0.1**
**Codes:** S = shipped · W = next wave · L = later · R = rejected

## S
- Offline-first PWA in `docs/`: no account, server, analytics, CDN, LLM, or post-load network calls
- **Design System v3 Amethyst** (dark-first elevation, grain, glow heroes, raised cards)
- Five tabs: Now · Calm · Journal · People · You; Settings sheet off You; About + What’s new
- 37 techniques with mechanisms, contraindications, context filtering, timed guidance, breathing
  sessions, device speech synthesis, optional haptics, and public-safe auto-quieting
- **Guided Path:** arrival → symptom chips → educational **approach pack** (CBT/DBT/ACT/BA ideas) →
  exercise Begin (rule-based; never diagnoses or modality prescriptions). Panic-like clusters offer
  Help. Sessions clearable in What SoulCap knows; hide card in Settings; Explore-folded on Now
- **Progress dashboard** on You (week dots + counts; no streaks/scores)
- Hard-coded keyword safety kernel on all user free-text surfaces (check-in detail, journal,
  story, plan, park, notes, manual, principles), number-free Help flow, persistent Help access,
  and 18+ age gate
- Private journal book: free writing, moods, emotion vocabulary chips, prompts, stickers,
  down-scaled photos, seven templates plus blank, verified on-device transcription where supported,
  local photo cover, month contents, search, optional page decoration, Thought Parking
- Constellation relationship map (Still/Drift/Live pace), optional history, safety plan, Journey
- One-tap check-ins with optional dimensions, direct need and trigger tags; evidence-backed local
  patterns with Low/Medium/High confidence, inspect, confirm, reject, hide; factual seven-day
  summaries; Emotional Timeline week view; Gentle Reflection Cards
- Personal Reset Menu on Calm; user Principles and **Personal Manual** on You
- Library article bookmarks (Saved filter); constellation person notes, events, ring history
- Optional **What’s happening?** picker on Now and Calm → experiences → skills (never forced)
- Eight library articles including fight/flight/freeze and wind-down/boundaries; optional evening
  wind-down hour (in-app card only, no notifications)
- Opt-in **Reflection check** (PHQ-9 / GAD-7): never diagnoses; item-9 → Help; top band →
  professional nudge; low-confidence correctable signals in What SoulCap knows
- Six optional daily supports with local-day completion only; no streaks, scores, reminders, or
  missed-day pressure
- Adaptive drip questionnaire (≤4 questions/day) with inspectable, correctable local estimates and
  confidence — never diagnoses
- Constellation polish: pinch rings, long-press rename, opt-in frequency sizing (not importance),
  safety-plan pull from supportive people
- Auto/Light/Dark/Night plus Ocean/Forest/Rain/Space/Sunrise/Minimal/AMOLED themes; purple-family
  accents; text, density, contrast, transparency, and reduced-motion controls; Roman Urdu LTR
  preview (English remains default safety language); welcome/onboarding/Calm/Me chrome in rui;
  local export and delete
- Playwright coverage across mobile + desktop (~260); CI gates GitHub Pages deploy
- Nest backend and Expo mobile **source labs only**; neither is wired to the PWA

## W
- Distortion lens + thought-record wizard detail (`SPEC-v2.2-approach-packs.md` remainder)
- Values / opposite-action / body-scan depth (`SPEC-v2.3-regulation-depth.md`)
- Sister / licensed review of path + technique copy (narrow path banner only after path sign-off)
- Native-reviewed Roman Urdu clinical copy (replace English safety strings only after review)
- Licensed clinician review of every technique before any reviewed/clinical claim
- Manual screen-reader pass notes beyond the automated dialog/zoom gates
- Encrypted optional local backup (passphrase)

## L
- On-device journal analysis only if it remains private, transparent, and correctable
- Native app, optional encrypted backup, and shared safety/skills engine
- Any clinician panel remains separate from the offline PWA and requires its own privacy,
  authorization, audit, and deployment review

## R
- Therapy, diagnosis, treatment, medical-device, or crisis-service claims without validation
- Crisis phone-number directory or country picker
- Wiring Nest, cloud speech, remote AI, analytics, or CDN assets into the offline PWA
- Streaks, scores, badges, guilt notifications, fake typing, or engagement pressure
- Treating localStorage journal data as an EHR
- AI therapy recommender / severity dashboards / modality prescriptions as treatment titles
