# Motion and UI System Rules

This document defines the UI system, theme and accent behavior, interaction rules, motion rules, and performance budgets.  
If a UI implementation violates these rules, stop and fix it before building more pages.

## 1) Design goals
- Premium and intentional.
- Not templated, not “Tailwind UI clone”.
- Photo-forward with strong editorial rhythm.
- Visual variety without confusion:
  - broken-grid moments on hero and key feature sections
  - consistent navigation and clear hierarchy

## 2) Two-world styling approach (shared DNA, different shells)
- Main (SSS): creative collective lean
  - warmer composition, editorial flow, human-first rhythm
- RoS: slightly more architectural
  - more grid discipline, more “system” framing, sharper geometry
- Shared across both:
  - typography system
  - icon style
  - motion rules
  - theme toggle and accent picker
  - account system

## 3) Theme system
- Support `light`, `dark`, and `system`.
- Default to `system` for new users.
- Theme toggle is present in the header on both subdomains.
- Theme preference persistence:
  - Anonymous: cookie
  - Logged-in: MongoDB `users.preferences.theme` and cookie mirror

### Theme application rules
- Theme must apply instantly with no flash or layout shift.
- Do not recolor photography based on theme.
- Preserve legibility and contrast in both themes.

## 4) Accent color system
- Accent color picker is present next to theme toggle in the header on both subdomains.
- Accent persistence:
  - Anonymous: cookie
  - Logged-in: MongoDB `users.preferences.accent` and cookie mirror
- Accent options:
  - provide a small curated set (8–12) of accessible accent colors
  - include a default that works in both themes

### Accent scope (strict)
Accent may affect only:
- focus rings and outlines
- primary buttons
- links and link hover decoration
- badges and small UI highlights
Accent must not:
- recolor photography
- recolor body text
- reduce readability or contrast

### Accessibility rule for accent
- If an accent fails contrast requirements in the current theme for a UI element:
  - adjust usage (limit to borders/highlights) rather than recoloring text.

## 5) Interaction rules (hover, click, focus)
### Hover rule (strict)
- Only interactive elements may respond to hover.
- If it animates on hover, it must be clickable.
- If it is clickable, it must have:
  - pointer cursor
  - focus ring
  - hover state
  - tap target >= 44px height on mobile
- Non-interactive elements:
  - no hover animation
  - no pointer cursor

### Focus rule (strict)
- Every interactive element must be keyboard reachable.
- Focus ring must be visible and use accent color in a compliant way.
- No focus removal without replacement.

## 6) Motion system: roles for Framer Motion vs GSAP
Use motion to improve clarity, hierarchy, and feedback, not as decoration.

### Framer Motion usage
Use for micro-interactions:
- button hover/press
- card hover
- nav active indicator
- dropdown open/close
- modal open/close
- small UI feedback transitions

### GSAP usage
Use for:
- section reveals triggered by scroll position
- rare hero sequences
- small typographic emphasis reveals on key headings

## 7) Motion budgets (hard constraints)
Per page limits:
- Max 1 hero animation sequence.
- Max 3 section reveal sequences.
- Max 8 animated elements simultaneously visible on screen.

Timing limits:
- Hover transitions: 150–250ms
- Reveal transitions: 350–650ms
- Do not exceed 900ms for any single transition.

Behavior limits:
- No scroll-jacking.
- No pinned sequences that trap the user.
- Animations must never block:
  - clicks
  - typing
  - scrolling
  - route transitions

## 8) Reduced motion compliance (required)
- Respect `prefers-reduced-motion: reduce`.
- When reduced motion is enabled:
  - disable GSAP timelines for reveals
  - replace with either:
    - instant render, or
    - a simple opacity fade (preferred)
- Preserve layout, spacing, and content.
- Keep focus and click behavior identical.

## 9) Image system rules
- Photo heavy pages with at least one full-bleed image per page.
- Images must be responsive:
  - correct sizes, lazy loading offscreen
  - avoid layout shift with known aspect ratios
- Do not apply heavy filters that change the integrity of the photography.
- Use Cloudinary transformations for thumb/card/hero sizing.

## 10) Component system approach
- Use Tailwind utilities.
- Do not use prebuilt template UI kits.
- Build a custom component set:
  - buttons
  - links
  - nav components (main vs RoS)
  - cards (main vs RoS variants)
  - forms
  - badges
  - modals
- Establish consistent spacing scale and type scale.
- Prefer simple, legible typography, avoid novelty fonts.

## 11) Performance guardrails
- Avoid heavy animation on mobile.
- Defer non-critical animation setup until after first paint.
- Lazy-load below-the-fold imagery.
- Keep route transitions fast and stable.
- Avoid hydration mismatch:
  - ensure theme and accent are applied before paint
- Keep bundle size minimal:
  - no large animation libraries beyond GSAP and Framer Motion
  - avoid unnecessary icon packs

## 12) Usability over spectacle
- Motion and visual variety must never:
  - hide navigation
  - reduce readability
  - create confusion about what is clickable
  - slow down core tasks (sign in, onboarding, voting)