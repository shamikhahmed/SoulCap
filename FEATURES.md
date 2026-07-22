# SoulCap — Features (S/W/L/R)

**Updated:** 2026-07-22 · Self-guided wellness companion · **v1.4.0**
**Codes:** S = shipped · W = next wave · L = later · R = rejected

## S
- Offline-first PWA in `docs/`: no account, server, analytics, CDN, LLM, or post-load network calls
- Five tabs: Now · Calm · Journal · People · You; Settings sheet off You
- 37 techniques with mechanisms, contraindications, context filtering, timed guidance, breathing
  sessions, device speech synthesis, optional haptics, and public-safe auto-quieting
- Hard-coded keyword safety kernel, number-free Help flow, persistent Help access, and 18+ age gate
- Private journal book: free writing, moods, emotion vocabulary chips, prompts, stickers,
  down-scaled photos, seven templates plus blank, verified on-device transcription where supported,
  local photo cover, month contents, search, optional page decoration, Thought Parking
- Constellation relationship map (Still/Drift/Live pace), optional history, safety plan, Journey
- One-tap check-ins with optional dimensions, direct need and trigger tags; evidence-backed local
  patterns with Low/Medium/High confidence, inspect, confirm, reject, hide; factual seven-day
  summaries; Emotional Timeline week view; Gentle Reflection Cards
- Personal Reset Menu on Calm; user Principles on You
- Six searchable offline emotional articles with source notes, support guidance, review-status
  honesty, and stable links to related exercises
- Six optional daily supports with local-day completion only; no streaks, scores, reminders, or
  missed-day pressure
- Adaptive drip questionnaire (≤4 questions/day) with inspectable, correctable local estimates and
  confidence — never diagnoses
- Constellation polish: pinch rings, long-press rename, opt-in frequency sizing (not importance),
  safety-plan pull from supportive people
- Auto/Light/Dark/Night plus Ocean/Forest/Rain/Space/Sunrise/Minimal/AMOLED themes; purple-family
  accents; text, density, contrast, transparency, and reduced-motion controls; Roman Urdu LTR
  preview (English remains default safety language); local export and delete
- Playwright coverage across mobile + desktop; CI gates GitHub Pages deploy
- Nest backend and Expo mobile **source labs only**; neither is wired to the PWA

## W
- Native-reviewed Roman Urdu clinical copy (replace English safety strings only after review)
- Personal Manual v1 (local templates from principles + confirmed patterns)
- Licensed clinician review of every technique before any reviewed/clinical claim
- Manual screen-reader pass notes beyond the automated dialog/zoom gates

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
