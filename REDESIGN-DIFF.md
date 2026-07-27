# Quiet Depth redesign diff — v6.0.10 → v7

Anti-lookalike gate from `SPEC-v7-redesign.md`. Baseline = `docs/screenshots/v6-baseline/`
(archived from v6.0.10 gallery). Current = `docs/screenshots/gallery/` (v7).

Open pairs in `screen-gallery.html` or side-by-side in a viewer. A screen **passes** only if
composition is intentionally different — not a token/density tweak of the same skeleton.

| Screen | v6.0.10 | v7 | Verdict |
|--------|---------|----|---------|
| Splash | *(no splash shot in baseline; old splash was logo + tagline on light)* | `mobile__default__splash.png` | **Pass** — dark room, one living radial breath, wordmark only |
| Welcome | `mobile__default__welcome.png` | `mobile__default__welcome.png` | **Pass** — full-bleed living field; thumb-zone Begin; not centered card stack |
| Onboarding (age) | `mobile__default__onboard-age.png` | `mobile__default__onboard-age.png` | **Pass** — serif prompt + ruled thumb rows + hairline progress |
| Now | `mobile__default__now.png` | `mobile__default__now.png` | **Pass** — arrival as **ruled rows** (not chip blob); open living focal (not boxed hero + 2-up tiles) |
| Calm | `mobile__default__calm.png` | `mobile__default__calm.png` | **Pass** — needs as hairline list; featured living hero; editorial browse (not wall of identical cards) |
| Journal | `mobile__default__journal.png` | `mobile__default__journal.png` | **Pass** — book cover kept; **timeline rail + boxed entries gone** → ruled contents |
| Constellation | `mobile__default__map.png` | `mobile__default__map.png` | **Pass** — living head + unboxed spatial stage + ruled People list (not lone boxed map card) |
| You | `mobile__default__me.png` | `mobile__default__me.png` | **Pass** — profile living hero; insights/tools as ruled sections (not insight card grid as default) |
| Help | `mobile__default__help.png` | `mobile__default__help.png` | **Pass** — depth-ramp sheet; number-free copy unchanged |
| Runner | `mobile__default__runner-breathing.png` | `mobile__default__runner-breathing.png` | **Pass** — same breath signature, Quiet Depth chrome / ease |
| Settings | `mobile__default__settings.png` | `mobile__default__settings.png` | **Pass** — sheet on new elevation ramp |

Desktop twins: same filenames with `desktop__` prefix. Spot-check `desktop__default__now.png` /
`calm.png` / `splash.png` — same compositional shift.

## What changed (identity, not polish)

1. **Editorial surface** — serif voice, hairlines (`qd-ruled` / `qd-row`), generous space; boxed cards no longer the default container.
2. **One living layer** — `--living` / `.living-field` behind heroes; Still + `prefers-reduced-motion` freeze it.
3. **Depth via light** — `--layer-0..3`, blurred thinner `#tabs`, sheet/nav depth ramp.
4. **Motion once** — `--ease-quiet`, press `scale(.98)`, View Transitions on splash dismiss + `selectTab`.

## Guardrails intact (spot-check)

- Offline / no network after load · ES5 in `docs/` · `el()` DOM
- Safety kernel + hard-coded Help · **no crisis numbers** · About “not therapy / not crisis” line
- Not addictive — no streaks/points/guilt · techniques not marked clinically reviewed

## Versions

- Shipped identity loop: **7.0.0** (V1) → **7.0.1** (V2–V5) → **7.0.2** (V6–V8) → **7.0.3** (V9 QA + this doc)
- SW `soulcap-v703` · schema **v13**

*Generated 2026-07-27 as SPEC-v7 phase V9.*
