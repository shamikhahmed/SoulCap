# SoulCap — Clinical Path (v0.2.0)

**Updated:** 2026-07-19  
**Status:** Clinical **path** — clinician-supported wellness companion.  
**Not** a cleared SaMD / medical device. **Not** a substitute for licensed care.

This file is the regulated + clinician MVP source of truth. Pair with `SAFETY.md`.

---

## What “clinical” means here

| Layer | Done in v0.2.0 | Still open |
|---|---|---|
| **Safety production gate** | Keyword crisis rail in PWA chat · panic/988 · consent checkbox · local audit log | Deployed Nest API · live webhook · LLM hard-rail e2e |
| **Clinician MVP** | Clinician panel (notes, consent view, audit) in PWA · Prisma roles already include `THERAPIST` · `/api/v1/clinical/*` stubs | AuthZ org membership · real DB persistence · PHI encryption ops |
| **Marketing / docs** | “Clinician-supported wellness companion (clinical path)” | Never claim FDA/CE clearance, diagnosis, or crisis counseling |
| **Regulated (SaMD)** | Gap checklist below | Legal, QMS, clinical evaluation, IRB if research |

---

## Hard rules (non-negotiable)

1. Companion **must not** claim therapist / doctor / crisis-counselor identity.
2. Companion **must not** diagnose.
3. Tier-3 crisis language → force resource handoff (988 / Crisis Text / IASP / emergency).
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
| 8 | Labeling / IFU (instructions for use) | 🟡 Crisis copy in-app |
| 9 | Licensed clinician protocol review | ❌ Required before real patients |
| 10 | Informed consent (versioned, recorded) | 🟡 Local PWA consent + Profile fields in Prisma |
| 11 | Audit trail (who/what/when) | 🟡 PWA local + `AuditLog` model |
| 12 | Crisis escalation ops (on-call webhook) | ❌ Config only in SafetyGate |

**Go/no-go:** Do **not** mark “clinical product” externally until items **1, 8, 9, 10** pass formal review.

---

## Clinician MVP surfaces

### PWA (docs/) — works offline today

- Mode toggle: **Member / Clinician**
- Session notes (local)
- Consent status (local + mirrors Profile intent)
- Safety/audit event list (local)

### Nest API stubs — `/api/v1/clinical`

- `GET /consent/:userId` — consent flags
- `POST /notes` — clinician session note
- `GET /notes/:userId` — list notes
- `GET /audit/:userId` — recent safety/audit events

Requires Clerk + org role `THERAPIST` or `ADMIN` for production; stubs accept `x-clinical-demo: 1` in non-prod.

---

## Architecture plan (v0.2)

```
Member PWA ──consent──► Chat (keyword SafetyGate client) ──tier3──► Crisis UI / 988
Clinician panel ──notes/audit──► localStorage (demo) │ Nest /clinical (when API live)
Prisma: Profile.consent* · MembershipRole.THERAPIST · AuditLog · SafetyFlag
```

---

## Test plan

- [ ] Onboarding blocks chat until consent checked
- [ ] Message containing crisis keywords opens Panic + freezes LLM mock reply
- [ ] Clinician note persists after reload
- [ ] Audit log records consent + crisis events
- [ ] `npm test` safety-gate unit (backend)
- [ ] No string claims “FDA”, “diagnosed”, “your therapist” in marketing HTML

## Rollback

Revert tag to `v0.1.0`. Restore `docs/sw.js` cache name. Hide clinician tab via `sc_clinical=0`.

---

## Version

Tracks `VERSION.json` → **0.2.0** · SW `soulcap-v020`.
