# E2E Test Infra: lemoon01110.github.io

## Test Philosophy
- Opaque-box, requirement-driven.
- Playwright headless browser automation to visually verify sections.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Quarto render | ORIGINAL_REQUEST R2 | 1      | 0      | 0      |
| 2 | Multi-style sections | ORIGINAL_REQUEST R1 | 1      | 0      | 0      |

## Test Architecture
- Test runner: `verify_build.sh` + Playwright script (e.g. `screenshot.js` or python equivalent)
- Test case format: Script returns exit code 0 if Quarto renders AND screenshots are successfully taken at different scroll depths/selectors.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Visit homepage, scroll to see 3 styles | 1, 2 | Low |

## Coverage Thresholds
- Tier 1: ≥1 per feature
- Tier 4: ≥1 realistic application scenarios
