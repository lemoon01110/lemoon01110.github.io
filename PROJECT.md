# Project: lemoon01110.github.io Redesign

## Architecture
- Quarto static site generation
- Custom CSS/JS via `index.qmd` and `custom.scss` to achieve multi-style long-scrolling homepage.
- Existing notes must remain intact.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Multi-Style Homepage | Update `index.qmd` and `custom.scss` to have 3 distinct aesthetic sections (interactive space theme, minimalist academic, dark glassmorphism) with smooth transitions. | none | PLANNED |

## Interface Contracts
### UI ↔ Backend
- No backend. Static site generated via `quarto render`.

## Code Layout
- `index.qmd`: Homepage entry point.
- `custom.scss`: Global/custom styles.
- `_quarto.yml`: Quarto configuration.
- `assets/`: Static assets (JS/images).
