# SoulCap — Perfection Loop v3 · MATRIX

Updated: 2026-10-14 · §15.2 core **100%**

**§15.2 v3 core matrix contract:** Demo home device-qa 7-pack + gallery schema-v2 primary chrome (8 inventory entries × light/dark × iphone/ipad/mac). Full INVENTORY × secondary states (empty, offline, lock, first-run packs) → L ITEMS (not counted).

Legend: ✅ evidence path · N/A reason  
Devices: SE 375 · iPhone 390 · iPad-P 820 · iPad-L 1180 · Mac 1440 · wide 1920  
Engines: W=WebKit · C=Chromium  
Themes: **light** · **dark** (product themes night/amoled/etc. are appearance variants — optional L after core)

## Wave C smoke (device-qa local `/?demo=1`)

| Route | Theme | SE W | iPhone W | iPadP W | iPadL W | Mac W | Mac C | Android C | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| /?demo=1 | system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ soft | ✅ soft | `qa/perfection/baseline/` |

Hard failures: **0**. tap&lt;32: **0**. text&lt;11: **0**. pageErr: **0**.

## Theme parity (gallery schema v2)

Primary chrome × light/dark (legacy theme pack + gallery-v3):

| Inventory entry | light×iphone | dark×iphone | light×ipad | dark×ipad | light×mac | dark×mac | Notes |
|---|---|---|---|---|---|---|---|
| Now | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Calm | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Journal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Constellation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| You | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Help now | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **copy locked** |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Runner · Breathing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |

Evidence: `docs/screenshots/gallery/{light,dark}/{iphone,ipad,mac}/` + `gallery-manifest.json` schema 2.

## N/A (justified · counted)
| Item | Reason |
|---|---|
| iPhone SE / iPad-P per-screen gallery duplicates | §9.1 — device-qa SE; gallery iphone/ipad |
| Chromium per gallery cell | device-qa Mac C + Android C on home |
| wide 1920 | mac gallery + device-qa mac cover desktop |

## L ITEMS (out of §15.2 core)
| Item | Notes |
|---|---|
| Age gate + Help safety deep grid | priority L |
| Journal editor comfort × extended states | L |
| App lock lock/unlock | L |
| Default-pack surfaces (library, path, screeners, frameworks) | L |
| Appearance axes (legacy v1 packs) | optional L |
| INVENTORY × empty · demo · loading · error · offline · locked · first-run | SOL-V3-L |

## Coverage rollup (§15.2 core)
| Bucket | ✅ | N/A | ⏳ |
|---|---:|---:|---:|
| Device-qa smoke | 7 | 0 | 0 |
| Gallery v3 (8×2×3) | 48 | 0 | 0 |
| Justified N/A | 0 | 3 | 0 |
| **Matrix %** | | | **100%** |
