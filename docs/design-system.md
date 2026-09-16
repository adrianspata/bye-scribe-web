# ByeScribe Design System — Visual Simplification (Fuse × ElevenLabs)

This document describes the visual design system, token architecture, theme management, materiality, Signal Color hierarchy, foundational components, and information architecture for ByeScribe.

**Product Name:** ByeScribe  
**Tagline:** The easier way to unsubscribe.  
**Design Concept:** Guided Clarity with Signal Color (Fuse × ElevenLabs Calibration)  

---

## 1. Goals & Architectural Vision

ByeScribe's interface is structured so the user immediately understands four core aspects:
1. **ByeScribe helps me unsubscribe from subscriptions.**
2. **I can search for a cancellation guide.**
3. **I can create a cancellation draft.**
4. **I can calculate potential savings.**

The design is centered, simple, minimalist, and materially refined.

### Roles of the References:
- **From Fuse:** Centered hero, concise and direct messaging, clear primary action, large continuous visual surfaces, streamlined navigation, generous yet controlled whitespace.
- **From ElevenLabs:** Warm off-white and charcoal base, black & white buttons, subtle grainy gradients, soft color transitions, varied card layouts, discreet borders and shadows.

---

## 2. Layout, Centering & Reading Width

The interface applies a disciplined centered layout without compromising readability for structured content:

- **Global container (`PageContainer`):** ~1120–1152 px (`max-w-[var(--spacing-container-max)]` with `mx-auto`).
- **Hero surface:** Centered composition (max width ~720–800 px).
- **Search bar:** Centered directly below the subtitle (max width ~560–680 px).
- **Editorial content:** ~60–65ch (`max-w-2xl` or `max-w-[var(--spacing-reading-max)]`).

### Centering Rules:
- **Centered:** Homepage hero, brief section introductions, closing summaries.
- **Left-aligned:** Form fields, privacy hints, error notices, cancellation steps, source citations, legal terms, and card descriptions.
- `text-center` is never applied globally to `PageContainer`.

---

## 3. Typography & No All-caps

- **Typefaces:** `KMR Melange Grotesk` (sans-serif) and `General Grotesque Mono` (monospace), loaded locally as WOFF2.
- **Headings (H1, H2, H3, etc.):** Use `font-normal` (`font-weight: 400`) for a clean, minimalist grotesque aesthetic.
- **H1 (Hero):** `text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-[1.1]`.
- **H2 & H3:** `font-normal tracking-tight`.
- **Form Fields & Focus:** Inputs, textareas, and selects feature no blue focus ring/outline, showing the clean dark-grey line consistent with hover (`border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]`).
- **Subtitle / Ingress:** `text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl`.
- **No All-caps:** User-visible uppercase styling is strictly removed (`text-transform: none`). Headings, categories, and badges use sentence or title casing.
- **Tabular Numbers:** `.tabular-nums` (`font-variant-numeric: tabular-nums`) for currency amounts, dates, and step numbers.

---

## 4. Navigation & Information Hierarchy

Main navigation is streamlined to key destinations:

1. **Brand Wordmark `ByeScribe`:** Links to the homepage (`/en`).
2. **`Guides`:** Links to the search and guide directory (`/en/sok`).
3. **`Draft Cancellation`:** Links directly to the message tool (`/en/verktyg/uppsagningsmeddelande`).
4. **`Savings Calculator`:** Links directly to the calculator (`/en/verktyg/besparingskalkylator`).

### Mobile Menu:
- Closes with Escape and returns focus to the hamburger toggle.
- Minimum 44 px touch targets (`min-h-[44px]`).
- Closes automatically on destination selection.
- Full keyboard and screen reader accessibility.

---

## 5. Accent Icons & Monochrome Action Buttons

To maintain clarity without visual clutter:

### Icon Palette:
- **Guides & Search:** Cobalt / Cyan (`#0284c7` in light, `#38bdf8` in dark).
- **Cancellation Drafts:** Violet / Lavender (`#7c3aed` in light, `#a78bfa` in dark).
- **Savings & Calculator:** Muted Teal / Green (`#0d9488` in light, `#2dd4bf` in dark).

Accent color is applied selectively to functional symbols and tool icons, avoiding saturated visual noise.

### Monochrome Buttons:
- **Primary Button:** Bg `#0c1117`, text `#ffffff` (light) / Bg `#f8fafc`, text `#0b0f17` (dark).
- **Secondary Button:** Neutral border and subtle interactive surface.
- **Step Badges (1, 2, 3):** Monochrome circles with tabular numbers.

---

## 6. Grainy Gradients & Materiality

Signal surfaces use controlled grain gradients with a local SVG texture (`/textures/signal-noise.svg`):

### Surface Palettes:
- **Release:** Lavender, pink, and warm orange (used in message generator card & process step 2).
- **Guidance:** Ice blue, cyan, and violet (used in calculator card, search & process step 1).
- **Completion:** Slate blue and green/teal (used in process step 3).
- **Summa:** Contextual signal gradient for personal finance tracking.

### Application Rules:
- **Applied to:** Hero decorative fields, tool visual headers, process steps, Summa CTA.
- **NEVER applied to:** Search results list, form inputs (`input`, `textarea`, `select`), source lists, legal contract terms, or error notices.

---

## 7. Cards & Corner Radii

- **Large Visual Cards:** 20–24 px corner radius (`rounded-[var(--radius-card-visual)]` = 22px / `1.375rem`), subtle border, and soft shadow (`shadow-subtle`).
- **Functional Form Cards:** Balanced standard radii (`rounded-[var(--radius-lg)]` = 16px / 1rem).
- **Interactive Card Hover:** Subtle border transition (`hover:border-[var(--color-border-strong)]`) and 1–2 px arrow nudge (`group-hover:translate-x-1`). No 3D tilt or cursor-follow glow.

---

## 8. Demo Elements & Transparency

- No "Local Demo" pills on homepage cards.
- A single neutral caption is kept for fixture transparency:
  `The services below are sample data in the local development environment.`
- On demo service guide pages, a neutral notice is displayed:
  `Local demo – this information is sample data and not a verified service guide.`
- Fixture service names retain "Demo" (e.g., *NordicPlay Demo*) so sample data is never confused with verified terms.

---

## 9. Privacy & Network Security

- **Zero network traffic for form inputs:** User inputs never leave the browser.
- **Zero persistent storage:** No personal data is stored in cookies, localStorage, or sessionStorage.
- **CSS-native system theme:** Themed 100% via CSS `prefers-color-scheme`.
- **Strict sanitization:** Query parameters and inputs are stripped of control characters.
- **External links:** Always include `rel="noopener noreferrer"`.

