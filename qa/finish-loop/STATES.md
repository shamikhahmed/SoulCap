# SoulCap — primary journey state coverage (G8)

Primary journey: check-in → technique → journal → help flow  
Updated: 2026-09-14

| State | Designed | Test / evidence | Notes |
|-------|----------|-----------------|-------|
| first use | ✅ | e2e onboarding / age gate | 18+ gate |
| empty | ✅ | empty Now / journal empty | |
| loading | N/A | offline-first local | no network fetch for core |
| success | ✅ | check-in save, skill complete | |
| error | ✅ | crisisSaveFailed path | panicSaveWarning |
| offline | ✅ | offline chip + SW | |
| no results | ✅ | library filters | |
| partial data | ✅ | preview week summary | |
| permission denied | N/A | no camera/mic required for core | journal mic optional later |
| expired session | N/A | no accounts | |
| invalid input | ✅ | age under-18 path | |
| destructive confirmation | ✅ | erase all data | safety.spec |
| network failure | N/A | core local | |
| server failure | N/A | no server in shipped PWA | |
| slow network | N/A | local | |
| interrupted operation | ⏳ | mid-onboarding / mid-import | add fixture test |

Help / crisis (SOUL-P0-02): region chips persist; verified tel: emergency + talk lines per DECISIONS §4.3; under-18 shows Emergency only.
