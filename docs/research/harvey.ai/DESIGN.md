# Harvey.ai — Reverse-Engineered Design System & HUD Architecture (`DESIGN.md`)

> Extracted via multi-skill reverse-engineering pipeline (`clone-website` + `VoltAgent/awesome-design-md` + `ui-ux-pro-max` + `anthropics/frontend-design`).

## 1. Brand & Aesthetic Philosophy
- **Archetype:** Institutional Frontier Authority ("Warm Obsidian Editorial Monograph + Agentic Command HUD")
- **Core Tension:** Alternates between deep warm near-black (`#0F0E0D`) architectural surfaces and serene warm-ivory paper (`#FAFAF9`), eliminating decorative SaaS gradients and drop shadows in favor of **1px hairline structural grids**, **tonal surface elevation** (`#0F0E0D` → `#171614` → `#1F1D1A`), and **high-contrast serif/sans/mono typography**.

## 2. Color Tokens
| Token | Hex | Role |
|---|---|---|
| `ink` | `#0F0E0D` | Primary dark canvas, Command Center frame, footer, primary CTA fill on light |
| `charcoal-tile` | `#191715` | Elevated HUD cards and interactive panels on `ink` |
| `charcoal-hover` | `#22201C` | Hover/active tile surface |
| `surface-paper` | `#FAFAF9` | Editorial light mode bands, primary inverse button fill |
| `surface-linen` | `#F1EFEA` | Secondary warm stone containers on light bands |
| `surface-warm` | `#CCCAC6` | Subtle borders on light, secondary labels on dark |
| `muted` | `#8F8B85` | Secondary copy on dark surfaces, metadata |
| `muted-deep` | `#706D66` | Captions, legal/compliance annotations |
| `border-dark` | `#2A2723` | 1px structural hairline borders on obsidian surfaces |
| `border-light` | `#E4E1DC` | 1px structural hairline borders on ivory paper |

## 3. Typography System
- **Display Serif** (`Harvey Serif` → `Instrument Serif` + CJK `Songti SC / Noto Serif SC`):
  - Hero Display: `clamp(2.75rem, 5.2vw, 4.75rem)`, weight `400`, line-height `1.05`, tracking `-0.02em`
  - Section Display: `clamp(2rem, 3.4vw, 3rem)`, weight `400`, line-height `1.1`, tracking `-0.015em`
- **Interface Sans** (`Harvey Sans Diatype` → `Plus Jakarta Sans` + CJK `PingFang SC / Noto Sans SC`):
  - Lead Body: `1.125rem–1.25rem`, weight `400`, line-height `1.55`
  - UI Body: `0.9375rem–1rem`, weight `400`, line-height `1.6`
  - Label / Nav: `0.875rem`, weight `500`, tracking `-0.01em`
- **HUD Telemetry Mono** (`JetBrains Mono`):
  - Metrics, audit timestamps, node IDs, benchmark percentages (`tabular-nums`, `0.75rem–0.8125rem`)

## 4. Signature UI & HUD Components Extracted from Harvey.ai
1. **Transparent-to-Obsidian Mega-Navbar:** Full-bleed `36px` horizontal padding, left wordmark, structured multi-column mega-dropdowns with featured editorial card, right sovereign node selector (`US / EU / AU` → localized sovereign cloud nodes) + solid high-contrast CTA.
2. **Command Center Analytics HUD:** Multi-pane dark glass/charcoal workspace tracking organizational adoption, active agent workflows, peer benchmarks, live citation audit logs, and deterministic status pills.
3. **4-Pillar Platform Switcher (Agents / Spaces / Vault / Horizon Scanning):** Asymmetric 12-column interactive showcase where left vertical tabs drive right-hand live HUD workspace previews.
4. **Editorial Portrait Quote Ledger:** Square `1:1` natural-light executive portraits paired with large serif pull-quotes and institutional wordmarks.
5. **Enterprise Security & Compliance Hairline Matrix:** 4x2 precision `1px`-bordered grid of monochrome regulatory badges with `Details →` micro-links.
