# Site Map and Route Ownership

This document defines all valid routes, which subdomain owns them, and the required access level.
If a route is not listed here, it must not be created without updating this file.

## 1) Subdomains
- Main: `sharpsighted.studio`
- RoS: `ros.sharpsighted.studio`

## 2) Global route rules
- Each subdomain has its own navigation and visual shell.
- Theme toggle and accent picker appear in the header on both subdomains.
- User session and identity are shared across subdomains.

### Access gating levels
- Public
- Authenticated
- Admin
- SuperAdmin

### Authorization behavior
- If a user is not authorized for a route:
  - Show a **Not Authorized** page.
  - Include clear sign-in and sign-up CTAs.
  - Do not return 404 for authorization failures.

### Onboarding enforcement
- Authenticated users with incomplete onboarding **must** be redirected to `/onboarding` before:
  - voting
  - submitting content
  - accessing account features
  - accessing admin routes
- Allowed routes before onboarding completion:
  - `/onboarding`
  - `/account/settings`
  - sign out

## 3) Main subdomain pages (`sharpsighted.studio`)

### Public
- `/` Home
- `/the-collective` About the collective and how it works
- `/10-percent-rule` The 10% Rule landing page
- `/blog` Blog index (includes RoS-tagged posts)
- `/blog/[slug]` Blog article page
- `/contact` Contact page
- `/legal/privacy` Privacy policy
- `/legal/terms` Terms

### Authenticated
- `/onboarding` Required first-run profile completion
- `/account` Account overview
- `/account/settings`
  - Theme and accent preferences
  - Profile basics
  - Display name change (if unlocked and available)

### Admin
- `/dashboard` Admin dashboard home
- `/dashboard/content`
  - Drafts list: posts, episodes, votes
- `/dashboard/content/new`
  - Create new post, episode, or vote
- `/dashboard/content/[id]`
  - Edit and preview draft

### SuperAdmin
- `/dashboard/users`
  - User and admin management
- `/dashboard/users/new-admin`
  - Create admin user

### Auth pages (Public)
- `/login`
- `/signup`
- `/verify`
- `/forgot-password` (only if credentials are used)
- `/reset-password` (only if credentials are used)

## 4) RoS subdomain pages (`ros.sharpsighted.studio`)

### Public
- `/` RoS landing page
- `/how-it-works` Rules and participation explanation
- `/challenges`
  - Current episode highlighted
  - Past episodes listed as cards
- `/challenges/[slug]`
  - Episode detail page (evergreen, beautiful)
- `/voting`
  - Active votes (interactive)
  - Locked results previews
  - Most recent episode summary block
- `/legal/privacy`
- `/legal/terms`

### Authenticated
- `/onboarding` Required first-run profile completion
- `/account` Account overview
- `/account/settings`
  - Theme and accent preferences
  - Profile basics
  - Display name change (if unlocked and available)

### Admin
- `/dashboard` Admin dashboard home (RoS shell)
- `/dashboard/content`
  - Drafts list: posts, episodes, votes
- `/dashboard/content/new`
  - Create new post, episode, or vote
- `/dashboard/content/[id]`
  - Edit and preview draft

### SuperAdmin
- `/dashboard/users`
- `/dashboard/users/new-admin`

### Auth pages (Public)
- `/login`
- `/signup`
- `/verify`
- `/forgot-password` (only if credentials are used)
- `/reset-password` (only if credentials are used)

## 5) Content ownership rules

### Blog
- Single blog system shared across the platform.
- Blog posts may be tagged:
  - `sss`
  - `ros`
- `/blog` on the main site is the canonical blog index.
- RoS does not have a `/blog` route.
- RoS-tagged posts may be linked from RoS pages, but canonical URLs live on the main site.

### Episodes and Challenges
- Episode is a first-class content type.
- RoS “Challenges” pages are driven by Episode data.
- Episode pages may include:
  - paper selection outcomes
  - benchmark outcomes
  - trap outcomes
  - ridiculous outcome (optional)
  - images and embedded media

### Voting
- Voting lives exclusively on RoS at `/voting`.
- Votes without results are visible to everyone.
- Vote results are hidden until the user votes.
- Voting interaction requires:
  - authenticated user
  - completed onboarding
- Main site may link to RoS voting but does not host voting UI.

## 6) Admin experience rules
- Admin routes exist on both subdomains.
- Capabilities are identical.
- Only visual shell differs.
- Public UX is mobile-first.
- Admin UX is desktop-first.
- Mobile admin support is optional, not required.