# SoulCap — Design system

Sober, Apple HIG-aligned, ported from the ScentCap 3.0 system (`ScentCap/src/design/system.css`, `DESIGN.md`) via VaultCap / PulseCap / DeePonyCap.
Content first; chrome stays quiet. SoulCap keeps its own accent: **Amethyst** (`#6D5DD3` light fills, darkened `--tint-text` for AA on light; `#8B7CF0` on dark).

Source of truth:

| File | Role | Loading |
|---|---|---|
| `docs/css/design/tokens.css` | Semantic tokens (light / dark / increased contrast) + Quiet Depth bridge | render-blocking, unlayered |
| `docs/css/design/system.css` | `ui-*` primitives (ScentCap port) | `@layer components` via `cascade.css` |
| `docs/css/design/soulcap.css` | Reskin of shell (`#tabs`, `.btn`, `.chip`, `#sheet`, `.view`) | `@layer components` |
| `docs/css/cascade.css` | Cascade orchestrator: brand / app / ios-tokens / foundation → `@layer legacy` | render-blocking |
| `docs/js/scroll-lock.js` | Body `position:fixed` + `top:-scrollY` while sheets/overlays open | sync script |
| `docs/js/hig-dt.js` | Dynamic Type `--dt-scale` | sync script |

## Principles

1. **Content first.** Calm copy and techniques carry the screen; surfaces are HIG grey/white or black/graphite.
2. **One accent.** Amethyst (`--tint` / `--tint-text`) marks the single primary action per screen, selection and links. Never decorative. Crisis red stays on Help only.
3. **System type.** SF (`--font-ui`) at 17pt body. Serif (`--voice`) remains for app voice lines.
4. **Native patterns.** Large titles on top-level screens, floating glass tab bar (phone) / glass sidebar (≥700px), sheets with grabber + Cancel / Title / Done, filled fields, flat buttons, chips.
5. **Accessible by default.** ≥44pt targets (SoulCap e2e still expects 48px where already set), AA contrast, reduced motion + transparency honoured, no network after load.

## Accent

Brand themes in `docs/brand.css` still set `--accent` (incl. lilac / mulberry). Tokens derive:

- `--tint: var(--accent)` — fills / selected sidebar
- `--tint-text: color-mix(… accent + black)` on light — links and selected tab labels (≥4.5:1 on white)
- `--on-tint: var(--accent-ink)` — label on filled controls

Do not introduce a second brand colour for chrome.

## Shell

- Phone (<700px): floating glass `#tabs` — Now · Calm · Journal · People · You. Document scrolls (no inner `.view` scroller). New tab → `scrollTo(0,0)`.
- ≥700px: glass sidebar (same `#tabs`, vertical) with “SoulCap” wordmark.
- Sheets: `#sheet` grabber; ScrollLock freezes the page; focus uses `{ preventScroll: true }`.
- SW: `skipWaiting` only on `message` `SKIP_WAITING`; no auto `clients.claim`.
- Check: `npm run ios:check` (docs served on port **8810**).

## Copy

Plain, warm, tentative. Sentence case. Not therapy. Crisis flows unchanged (see `SAFETY.md`).
