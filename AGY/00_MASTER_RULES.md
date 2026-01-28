# AGY Master Rules for Sharp Sighted Studio + Ripped or Stamped

These rules are non-negotiable. If a requested change conflicts with these rules, stop and ask for a decision.

## 1) Product Scope
- Build one Next.js app that serves two subdomains:
  - `sharpsighted.studio` (Main)
  - `ros.sharpsighted.studio` (RoS)
- Both must use one shared authentication system and one shared MongoDB database.
- Each subdomain must have its own navigation and its own visual shell.
- Users must never be forced to create separate accounts for the two subdomains.

## 2) UX Rules
- No scroll-jacking. Users must always control scroll.
- Section reveals are allowed. Do not pin or scrub the page in a way that hijacks scroll.
- Hover animations only apply to interactive elements.
  - If it animates on hover, it must be clickable.
  - If it is clickable, it must have clear affordance: cursor, focus ring, hover, and tap target size.
  - Non-interactive elements must not animate on hover and must not show pointer cursor.
- Accessibility is mandatory:
  - Keyboard navigation works everywhere.
  - Visible focus states everywhere.
  - Color contrast is respected in both themes.
  - `prefers-reduced-motion` must be supported.
  - Site is mobile first for users, and desktop first for admins. Mobile views for admins are optional.

## 3) Visual and Layout Direction
- Premium and intentional, not templated.
- Use Tailwind for utilities, but do not use Tailwind UI templates or a templated component library look.
- Use broken-grid moments on hero and feature sections, but keep UX clear.
- Every page includes at least one full-bleed image moment.
- Standard scroll with section reveals. No scroll-jacking.

## 4) Motion System Rules
Use both Framer Motion and GSAP, but only when it improves clarity.

### Motion hierarchy
- Framer Motion: micro-interactions
  - hover, press, dropdowns, nav indicators, small UI transitions
- GSAP: section reveals and rare hero sequences
  - reveal sequences for headings and key content blocks
  - one signature hero sequence per page maximum

### Hard limits per page
- Max 1 hero animation sequence per page.
- Max 3 section reveal sequences per page.
- Max 8 animated elements simultaneously visible on screen.
- Durations:
  - 150–250ms for hover transitions
  - 350–650ms for reveals
- Animations must never block clicks, typing, or navigation.

### Reduced motion
- If `prefers-reduced-motion: reduce`:
  - Disable GSAP reveal timelines.
  - Replace with either instant render or a simple opacity fade. Prefer fade.
  - Keep the same layout and content, only reduce movement.

## 5) Theme and Accent System
- Site supports light and dark mode.
- Theme toggle exists on both subdomains, persistent across both.
- Accent color picker exists next to the theme toggle, persistent across both.
- Persistence rules:
  - For anonymous users: persist in cookies.
  - For logged-in users: persist in MongoDB user profile and mirror in cookies for instant load.

### Accent color scope
Accent color may affect only:
- focus rings
- primary buttons
- links and link hover decoration
- badges and small UI highlights
Accent color must not:
- recolor photography
- recolor body text
- reduce readability or contrast

## 6) Auth, Accounts, and Security
- One shared auth system for both subdomains.
- Each subdomain must have its own login page.
- Email must be unique per user identity.
- Account linking and merge rules:
  - If a user signs in with email and later uses Google with the same verified email, link to the same user record.
  - Do not create duplicate user records for the same verified email.
  - Never auto-link unverified emails.
- Signup must be verified:
  - Use magic link or OTP to verify email.
- Include standard flows:
  - sign in
  - sign out
  - forgot password and reset password if credentials are used
  - email verification
- Session must be shared across subdomains via parent-domain cookie settings.
### Post-verification onboarding (required)
- After a user verifies their email and a session is established, they must complete onboarding before accessing any other authenticated areas or actions.
- Onboarding must collect:
  - `firstName`
  - `displayName` (public attribution name)
- `displayName` must be unique site-wide.
  - Enforce uniqueness at the database level using a normalized field (example: `displayNameLower`) with a unique index.
- Until onboarding is completed:
  - Redirect the user to `/onboarding` on the current subdomain.
  - Disable voting, commenting, and any participation actions.
  - Allow only `/onboarding`, `/account/settings` (optional), and sign-out.
  - Users can change display name later only if the new one is available. 3-month lockout after change.

## 7) Roles and Access Control
Roles:
- `user`
- `admin`
- `superAdmin`

Gating levels:
- Public: anyone
- Authenticated: logged-in users
- Admin: `admin` + `superAdmin`
- Super admin: `superAdmin` only

Access behaviors:
- If not authorized, show a Not Authorized page with a clear sign-up or sign-in CTA.
- Do not return 404 for authorization failures. We always favor conversion over frustration.

Deletion rules:
- Never permanently delete users, admins, votes, posts, or results.
- Use soft states:
  - deactivate permanently
  - suspend time-based
  - close votes and archive

## 8) Admin Governance
- Super admin can:
  - add admins
  - suspend or deactivate admins
  - publish content
  - close votes
- Admins can:
  - create drafts for blog posts, votes, challenges
  - preview drafts
- Admins cannot:
  - add other admins
  - publish
  - delete anything
- Publish flow:
  - Admin creates draft.
  - Super admin reviews and publishes.

## 9) Voting Rules
- Voting requires login.
- Anonymous users can view vote content but cannot interact.
- One vote per user per vote.
- Votes cannot be changed after submission.
- Vote results are hidden until the user votes.
- All votes are single-choice.

Episode challenge votes are multi-part:
- Rubric A: exactly 3 options.
- Rubric B: 3–5 options.
- Rubric C: optional.
  - First 5 users can submit a custom entry up to 120 characters.
  - Custom entries appear in real time.
  - Users can vote once entries exist.
  - After 5 entries, submission closes and becomes read-only.

Vote scheduling:
- Votes may optionally have an end timestamp.
- If “end at a specific time” is unchecked, vote ends only when manually closed by super admin.

## 10) Data and Storage
- MongoDB is the primary database for:
  - users and roles
  - posts
  - episodes
  - vote requests, live votes, ballots, and results
  - challenge definitions and completed challenge results
- Cloudinary is used for images.
  - Upload originals.
  - Transform on delivery.
  - Use consistent foldering by content type (defined in `05_CLOUDINARY.md`).

## 11) Performance and Quality Gates
- Avoid heavy animation on mobile.
- Lazy-load offscreen images.
- Use responsive images.
- No UI lag on navigation.
- No hydration mismatch warnings.
- Keep bundle sizes minimal.
- Ensure route-level gating happens before rendering protected content.

## 12) Implementation Style Rules
- Prefer server-side enforcement for auth and role gating.
- Use clear separation:
  - shared components and utilities in a shared folder
  - subdomain-specific shells and navs separated cleanly
- No “magic” behavior without an explicit rule in these docs.