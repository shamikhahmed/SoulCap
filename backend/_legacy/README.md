# _legacy — quarantined, not compiled

Code moved out of `src/` because it was dead, superseded, or built on a premise the current
design has inverted. Kept for reference, not deleted. Nothing here is in the TypeScript build.

## auth-jwt (quarantined 2026-07-21)

Email + password auth using `@nestjs/passport` + `passport-jwt`.

**Why removed:** SoulCap authenticates with Clerk. `ClerkAuthGuard` is registered globally in
`app.module.ts`; this path was never wired — `AuthModule` only ever registered
`ClerkWebhookController`. `AuthService`, `AuthController` and `JwtAuthGuard` were referenced
nowhere in `src/`, and their dependencies (`@nestjs/passport`, `passport-jwt`) were never
installed, so this code had never compiled.

Accounted for 7 of the 34 TypeScript errors outstanding at the time.

**If password auth is ever wanted:** treat this as a sketch, not a starting point. It predates
the Clerk organization/membership model the rest of the codebase assumes.

## ai-stack-v1 (quarantined 2026-07-21)

An entire earlier generation of the AI stack, running in parallel with the live one:

| Quarantined (v1) | Live equivalent |
|---|---|
| `ai-orchestration/ai-orchestration.service.ts` | `src/ai/pipeline/pipeline.service.ts` |
| `ai-orchestration/response-strategy.service.ts` | `src/ai/router/model-router.service.ts` |
| `ai-orchestration/intervention-engine.service.ts` | `src/ai/prompts/prompt-builder.service.ts` |
| `emotional-analysis/emotional-analysis.service.ts` | `src/ai/pipeline/steps/emotion-detection.step.ts` |
| `safety/safety.service.ts` | `src/ai/safety/safety-gate.service.ts` |
| `living-mind.types.ts` | `src/common/types` (Prisma-generated enums) |

**Why removed:** none of it was ever registered in `app.module.ts`, and nothing outside the
stack imported it — it was fully self-contained dead weight. v1 defines its own hand-written
enums in `living-mind.types.ts`; the live stack derives the same enums from the Prisma schema,
so the two type systems had already drifted apart.

**The reason this mattered, not just tidiness:** the two safety implementations disagreed.
v1's `SafetyService` treats `saying goodbye`, `giving away`, and `farewell` as unconditional
Tier-3 crisis triggers. The live `SafetyGateService` treats them as *contextual* — Tier 3 only
when they co-occur with distress language, which is the better-calibrated behaviour and the one
covered by tests. Two divergent safety keyword lists in one repository is exactly the drift the
shared-engine-package decision exists to prevent.

**If anything here is wanted back**, port the behaviour into the live stack under
`src/ai/` — do not re-register these modules.
