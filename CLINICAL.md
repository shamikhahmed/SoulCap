# SoulCap — Clinical Readiness Gaps (v0.8.1)

**Updated:** 2026-07-22
**Status:** Self-guided wellness companion; clinical work is undeployed lab source only.
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.

This file records what would be required before any clinical path. `SAFETY.md` is the shipped
product truth. Nothing here turns the PWA into clinical care.

---

## What “clinical” means here

| Layer | Current reality | Still open |
|---|---|---|
| **Safety production gate** | Offline keyword gate, hard-coded number-free Help, consent, deploy-gating tests | Clinical review, broader eval set, oblique-risk classifier |
| **Clinician MVP** | Nest/Prisma source stubs only; not deployed or connected | AuthZ, real persistence, PHI controls, audit, operations, clinical governance |
| **Marketing / docs** | Self-guided wellness companion | Never claim FDA/CE clearance, diagnosis, treatment, or crisis counselling |
| **Regulated (SaMD)** | Gap checklist below | Legal, QMS, clinical evaluation, IRB if research |

---

## Hard rules (non-negotiable)

1. Companion **must not** claim therapist / doctor / crisis-counselor identity.
2. Companion **must not** diagnose.
3. Tier-3 crisis language → force hard-coded, country-agnostic Help guidance.
4. Clinician notes are **clinician-authored**, not generated as “medical advice.”
5. Real-user PHI production requires: signed BAA (if US HIPAA applies), encryption, access audit, retention policy, breach process.

---

## SaMD / regulated gap checklist

Use this before any claim that looks medical-device-shaped.

| # | Item | Status |
|---|---|---|
| 1 | Intended use statement (wellness vs diagnosis/treatment) | Draft in SAFETY.md + this file |
| 2 | Risk classification (IEC 62304 / FDA SaMD) | ❌ Not started |
| 3 | Quality management system | ❌ |
| 4 | Clinical evaluation / literature review | ❌ |
| 5 | Usability / IEC 62366 | ❌ |
| 6 | Cybersecurity + PHI threat model | 🟡 Inventory only |
| 7 | Post-market surveillance plan | ❌ |
| 8 | Labeling / IFU (instructions for use) | 🟡 Help copy in-app |
| 9 | Licensed clinician protocol review | ❌ Required before real patients |
| 10 | Informed consent (versioned, recorded) | 🟡 Local PWA consent + Profile fields in Prisma |
| 11 | Audit trail (who/what/when) | 🟡 PWA local + `AuditLog` model |
| 12 | Crisis escalation ops (on-call webhook) | ❌ Config only in SafetyGate |

**Go/no-go:** Do **not** mark “clinical product” externally until items **1, 8, 9, 10** pass formal review.

---

## Clinician MVP surfaces

### PWA (`docs/`) — works offline today

- No clinician mode, clinician notes, EHR, account, or PHI backend
- Self-guided skills, private journal, Constellation, check-ins, and safety plan
- Consent and all user data stay in localStorage

### Nest API stubs — `/api/v1/clinical`

- `GET /consent/:userId` — consent flags
- `POST /notes` — clinician session note
- `GET /notes/:userId` — list notes
- `GET /audit/:userId` — recent safety/audit events

Requires Clerk + org role `THERAPIST` or `ADMIN` for production; stubs accept `x-clinical-demo: 1` in non-prod.

---

## Architecture boundary

```
Offline PWA ──local state──► deterministic skills/journal/safety kernel
Offline PWA ──no connection──X Nest /clinical lab
Nest lab ──future only──► auth + database + audit, after separate approval
```

---

## Test plan

- [x] Age/consent onboarding gates the self-guided PWA
- [x] Tier-3 response uses hard-coded copy
- [x] Help is reachable from every screen and installed shortcut
- [x] Data export and deletion cover shipped local state
- [ ] Non-THERAPIST rejected from any future `/clinical` deployment
- [ ] Clinician records encrypted, audited, retained, and deleted under reviewed policy
- [ ] Independent clinical and safety evaluation completed before clinical claims

## Rollback

Use a normal revert and a new service-worker cache version. Never roll back by deleting user data.

---

## Version

Tracks `VERSION.json` → **0.8.1** · SW `soulcap-v081`.
