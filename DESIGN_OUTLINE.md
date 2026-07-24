# Lemon — Personal Site · Design Outline

A brief for the homepage visual system. Goal: a **characterful dark developer/researcher portfolio** with
signature interactive UI — bold and interactive, **not** a stack of identical glass cards.

---

## 1. Who it's for
- **Owner:** "Lemon" — student at Lynbrook High School, San Jose CA. AI/ML + maths, systems, security.
- **Purpose:** personal home base + digital notebook + showcase of projects and interactive teaching tools.
- **Tone:** curious, technical, playful-but-serious. Substance over hype. *No fake/filler data.*

## 2. Aesthetic direction — balanced
- **Keep:** ASCII-art hero, constellation / star-drive background, slot-machine seniority, analog+digital pill clock, Chroma color-field feature, footer zigzag + light rays, navbar intellisense.
- **Drop:** brutalist mono "01 //" card chrome as the default; glass panels wrapping every block.
- **Balance:** aio-guide-style **section rhythm** (alternating bands + a different composition per section) plus Lemon **depth** (particles, multi-hue scene washes). Cards only where interaction needs a hit target (notes tiles, Chroma CTA surface).

## 3. Design tokens
**Base:** near-black `--bg` / `--bg-alt` bands.

**Section accents (multi-hue):**
- Hero — indigo `#a78bfa` + teal sparks
- About — teal `#5fb8ad`
- Tools — teal (Chroma)
- Projects — coral `#e08a6a`
- Literature — citrus `#c6a15b`
- Notes — indigo `#7c9cff`

**Type:**
- Display: **Fraunces**
- Body / UI: **Hanken Grotesk**
- Mono (labels, clock, code): **JetBrains Mono**

## 4. Structure — one continuous scrollable page
1. **Hero** — full-bleed ASCII "Hi, I'm Lemon" over constellation; scroll cue.
2. **About** — open intro (slot seniority + Lynbrook pill); status widgets (location slot + pill clock) in a horizontal strip; interested-in / current-focus as two open definition columns.
3. **Interactive Tools** — OpenGate; Chroma as split color-field feature (banner *is* the visual).
4. **Projects** — feature article (eyebrow + title + prose + tags + link), no glass panel.
5. **Literature** — open shelves (AI/ML, Systems) + dystopian prose band with Read / On radar lists.
6. **Notes** — grid of light interactive tiles (only card-like surfaces on the page).
7. **Footer** — brand, socials, links, zigzag + calm light rays.

## 5. Interactions & motion
- Constellation (parallax, scroll-accelerated); multi-hue star sparks (teal / citrus / indigo).
- Scroll-reactive `#scene-bg` washes per `data-scene`.
- Slot-machine word rolls, live clock.
- Subtle tilt **only** on notes tiles (not every former glass card).
- `?still` / `prefers-reduced-motion` freezes motion.

## 6. Guardrails
- Dark theme; Fraunces + Hanken + JetBrains Mono.
- Accessibility: legible contrast, keyboard-operable, respect reduced motion.
- Static Quarto site + client-side JS; no backend.
- Substance rule: no contentless widgets.
