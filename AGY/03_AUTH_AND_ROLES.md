# Auth and Roles (Auth.js + MongoDB)

This document defines authentication, account linking, session sharing across subdomains, onboarding enforcement, and role-based access control (RBAC).  
If an auth-related implementation conflicts with this doc, stop and ask for a decision.

## 1) Auth approach
- Use Auth.js (NextAuth v5) with MongoDB adapter.
- Providers:
  - Email magic link (required)
  - Google OAuth (required)
- Credentials password login is optional and not required for launch.
  - If credentials are not used, do not implement forgot/reset password routes.

## 2) Subdomain session sharing
Goal: a user signs in on either subdomain and is authenticated on both.

Rules:
- Cookies must be configured for the parent domain:
  - cookie domain: `.sharpsighted.studio`
- Session must work on:
  - `https://sharpsighted.studio`
  - `https://ros.sharpsighted.studio`
- Each subdomain has its own login pages:
  - `/login` and `/signup` exist on both subdomains.

## 3) Google OAuth configuration requirements
- Google Cloud Console OAuth client must include both origins:
  - `https://sharpsighted.studio`
  - `https://ros.sharpsighted.studio`
- Authorized redirect URIs must include:
  - `https://sharpsighted.studio/api/auth/callback/google`
  - `https://ros.sharpsighted.studio/api/auth/callback/google`

## 4) Email verification
- Email magic link is the primary verification mechanism.
- A user is not considered verified until `emailVerifiedAt` is set.
- After email verification:
  - A session is established.
  - User is redirected immediately to `/onboarding` on the same subdomain they verified from.

## 5) Account linking and merge-by-email rules
Goal: no duplicate accounts for the same verified email.

Rules:
- Canonical identifier is verified email address.
- If a user signs in with email magic link and later signs in with Google using the same verified email:
  - Link the Google provider to the same user record.
  - Do not create a new user record.
- If Google sign-in occurs first:
  - Create user using Google email only if Google returns a verified email claim.
- Never auto-link unverified emails.
- If a conflict occurs (provider email unverified or mismatch), block linking and prompt user to verify email.

## 6) Onboarding enforcement (required)
Goal: after verification, users must provide first name and unique display name before doing anything else.

Data requirements:
- `firstName` required
- `displayName` required and unique site-wide
- `displayNameLower` must be used for uniqueness checks and indexing
- `displayNameChangedAt` is used for lockout enforcement

Behavior:
- If authenticated AND `onboarding.isComplete` is false:
  - Redirect to `/onboarding` on the current subdomain before allowing:
    - voting
    - viewing vote results
    - creating Rubric C entries
    - any admin access
    - account usage except `/account/settings`
- Allowed routes before onboarding completion:
  - `/onboarding`
  - `/account/settings`
  - sign out

Display name change rule:
- Display name can be changed later only if:
  - new display name is available
  - at least 90 days have elapsed since `displayNameChangedAt`
- On change:
  - update `displayName`, `displayNameLower`, and `displayNameChangedAt`
  - log action to audit log

## 7) Roles and RBAC
Roles:
- `user`
- `admin`
- `superAdmin`

Gating levels:
- Public: anyone
- Authenticated: logged-in users with onboarding complete
- Admin: `admin` + `superAdmin` with onboarding complete
- SuperAdmin: `superAdmin` with onboarding complete

Authorization behavior:
- If the user is not authorized:
  - Show Not Authorized page with sign-in and sign-up CTAs
  - Do not return 404 for auth failures

## 8) Route protection strategy
Use both:
- Server-side protection for data and actions
- Middleware/route-level gating to prevent rendering protected pages

Rules:
- All admin routes must be protected before render.
- All vote submission endpoints must validate:
  - authenticated
  - onboarding complete
  - vote status is `published`
  - vote is not closed
  - user has not already voted (ballot unique index)
- All results endpoints must validate:
  - authenticated
  - onboarding complete
  - user has voted in that vote

## 9) Admin account governance
- Only super admin can:
  - create admins
  - suspend admins (time-based)
  - deactivate admins (permanent)
  - publish drafts
  - close votes
- Admin can:
  - create drafts
  - edit drafts
  - preview drafts
- No permanent deletion for any entity.

## 10) Audit logging (required)
Log these events at minimum:
- `ADMIN_CREATED`
- `ADMIN_SUSPENDED`
- `ADMIN_DEACTIVATED`
- `VOTE_PUBLISHED`
- `VOTE_CLOSED`
- `DISPLAYNAME_CHANGED`
- `ONBOARDING_COMPLETED`
- `LOGIN_EMAIL`
- `LOGIN_GOOGLE`

Audit log must:
- be append-only
- never store secrets or tokens