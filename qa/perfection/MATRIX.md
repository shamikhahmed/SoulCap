# SoulCap — Perfection Loop v3 · MATRIX

Legend: ✅ evidence path · ⏳ pending · N/A reason  
Devices: SE 375 · iPhone 390 · iPad-P 820 · iPad-L 1180 · Mac 1440 · wide 1920  
Engines: W=WebKit · C=Chromium  
Themes: **light** · **dark** (product themes night/amoled/etc. are appearance variants — Phase G)

## Wave C smoke (device-qa local `/?demo=1`)

| Route | Theme | SE W | iPhone W | iPadP W | iPadL W | Mac W | Mac C | Android C | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| /?demo=1 | system | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ soft | ✅ soft | `qa/perfection/baseline/` |

Hard failures: **0**. tap&lt;32: **0**. text&lt;11: **0**. pageErr: **0**.

## Theme parity (gallery schema v2)

Primary chrome × light/dark (bridged from legacy theme pack + refreshed by gallery-v3):

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

## Full matrix (Phase C/G — remaining)

Rows = INVENTORY × states (empty · demo · loading · error · offline · locked · first-run). Fill during Phase G.

Priority next:
1. Age gate + Help × light/dark × all devices (safety)
2. Journal editor comfort × Mac + iPad
3. App lock lock/unlock
4. Default-pack surfaces (library, path, screeners, frameworks)
5. Appearance axes (legacy v1 packs) — optional after core L/D complete
