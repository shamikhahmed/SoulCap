# SoulCap innerHTML sinks

Generated: 2026-09-15 · Product scan = `docs/` (Pages PWA). Lab `backend/` + `mobile/` excluded (P-SOUL-2).

## Policy
- Prefer `textContent` / DOM APIs for user or remote strings
- Static SVG path chrome templates: OK
- `el(..., { html })` helper must only receive caller-controlled static markup (never user/remote)

## Counts

| Class | Count |
|-------|------:|
| static-template | 2 |
| escaped-user-remote | 0 |

## Inventory

| File | Line | Class | Notes |
|------|-----:|-------|-------|
| docs/app.js | 766 | static-template | `el()` helper `attrs.html` → callers must pass static markup only; user strings use `text` |
| docs/app.js | 2875 | static-template | Fixed SVG `<path>` icons for Guide toggle (no user input) |

## Verify
- Injection fixture `"><img src=x onerror=alert(1)>` covered on journal / check-in / people fields via existing e2e (text path, not html attr)
- Re-run `npm run tier1` after any new `.innerHTML =`
