# Authentication System – Complete Guide

> **Audience**: Junior engineers who are learning auth and want to understand exactly how this system works.

This document explains the authentication (auth) system used in Sharp Sighted Studio. Auth is the mechanism that verifies **who someone is** (authentication) and **what they're allowed to do** (authorization).

---

## Table of Contents

1. [Overview – What Auth Method Do We Use?](#overview)
2. [Where Do the Auth Files Live?](#file-locations)
3. [How Authentication Works (Step by Step)](#how-it-works)
4. [Session & JWT Explained](#session-and-jwt)
5. [Protecting Routes](#protecting-routes)
6. [Role-Based Access Control (RBAC)](#rbac)
7. [Cross-Subdomain Auth](#cross-subdomain)
8. [Quick Reference – Code Patterns](#quick-reference)

---

<a name="overview"></a>
## 1. Overview – What Auth Method Do We Use?

We use **NextAuth.js v5** (also called Auth.js) with:

| Feature | Value |
|---------|-------|
| **Auth Library** | NextAuth v5 (`next-auth@beta`) |
| **Session Strategy** | JWT (JSON Web Token) – stored in a cookie |
| **Database Adapter** | MongoDB |
| **Login Methods** | 1. Email Magic Link (primary) <br> 2. Google OAuth (optional) |
| **Password Login** | Not implemented |

### What is a "Magic Link"?
Instead of entering a password, users enter their email and receive a one-time login link. When they click it, they're signed in. This is more secure than passwords because there's nothing to remember or leak.

### Why JWT instead of Database Sessions?
JWT stores session data **in the cookie itself**, cryptographically signed. This means:
- Faster: No database lookup on every request
- Edge-compatible: Works with Next.js middleware
- Trade-off: Can't instantly revoke sessions (they expire on their own)

---

<a name="file-locations"></a>
## 2. Where Do the Auth Files Live?

Here's your mental map of the key files:

```
src/
├── auth.ts                           ← 🔑 THE MAIN CONFIG FILE
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                  ← NextAuth API handler (thin wrapper)
│   ├── login/page.tsx                ← Login page (public)
│   ├── signup/page.tsx               ← Signup page (public) 
│   ├── onboarding/page.tsx           ← Post-login onboarding (protected)
│   ├── dashboard/
│   │   └── layout.tsx                ← 🛡️ ADMIN PROTECTION (server-side redirect)
│   └── api/admin/*/route.ts          ← 🛡️ ADMIN API PROTECTION (status codes)
├── components/
│   ├── providers/AuthProvider.tsx    ← React SessionProvider wrapper
│   └── auth/
│       ├── LoginForm.tsx             ← Login UI
│       └── OnboardingForm.tsx        ← Onboarding UI
├── types/
│   ├── next-auth.d.ts                ← TypeScript type extensions
│   └── auth.ts                       ← Custom auth types
└── lib/db/
    └── user.ts                       ← User database operations
```

### The Most Important File: `src/auth.ts`

This is where everything is configured:

| Section | What It Does |
|---------|--------------|
| `providers` | Configures login methods (Email, Google) |
| `adapter` | Connects to MongoDB to persist users/accounts |
| `session` | Sets JWT strategy with 30-day expiry |
| `cookies` | Configures cross-subdomain cookies |
| `callbacks.jwt` | Puts custom claims (role, displayName) into the JWT |
| `callbacks.session` | Makes those claims available to React components |
| `pages` | Custom URLs for login, verify, error pages |

---

<a name="how-it-works"></a>
## 3. How Authentication Works (Step by Step)

### Flow 1: Email Magic Link Login

```
┌─────────────────────────────────────────────────────────────────┐
│ User enters email on /login                                     │
│                         ↓                                       │
│ NextAuth sends magic link email (or logs to console in dev)     │
│                         ↓                                       │
│ User clicks link → /api/auth/callback/email?token=xxx           │
│                         ↓                                       │
│ NextAuth validates token, creates/finds user in MongoDB         │
│                         ↓                                       │
│ JWT callback runs → adds user.id, role, displayName to JWT      │
│                         ↓                                       │
│ Session callback runs → exposes JWT claims to session.user      │
│                         ↓                                       │
│ Cookie set with JWT → user redirected to /onboarding or /       │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 2: Google OAuth Login

Same as above, but:
1. User clicks "Sign in with Google"
2. Redirected to Google's login
3. Google redirects back to `/api/auth/callback/google`
4. If email matches existing user, accounts are **linked** (not duplicated)

---

<a name="session-and-jwt"></a>
## 4. Session & JWT Explained

### What's in the JWT?

The JWT contains these custom claims (defined in `auth.ts` callbacks):

```typescript
{
  id: "507f1f77bcf86cd799439011",     // MongoDB user ID
  role: "user" | "admin" | "superAdmin",
  displayName: "JohnDoe" | null,
  onboardingComplete: true | false
}
```

### How to Access Session Data

**Server Components / API Routes:**
```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    // Not logged in
  }
  
  console.log(session.user.role);           // "user", "admin", or "superAdmin"
  console.log(session.user.displayName);    // Their display name
  console.log(session.user.onboardingComplete); // Did they complete onboarding?
}
```

**Client Components:**
```typescript
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not logged in</p>;
  
  return <p>Hello, {session?.user?.displayName}</p>;
}
```

---

<a name="protecting-routes"></a>
## 5. Protecting Routes

### There are TWO types of protection:

| Type | Where | What It Does |
|------|-------|--------------|
| **Page Protection** | `layout.tsx` or `page.tsx` | Redirects unauthorized users before rendering |
| **API Protection** | `route.ts` | Returns 401/403 status codes |

---

### A) Protecting Pages (Server Components)

Use `redirect()` from `next/navigation`. The protection goes in either:
- The page itself (`page.tsx`)
- A shared layout (`layout.tsx`) to protect all children

**Example: Dashboard Layout Protection**
```typescript
// src/app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  // ❌ Not logged in → send to login
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // ❌ Not admin → send to unauthorized page
  const isAdmin = session.user.role === "admin" || session.user.role === "superAdmin";
  if (!isAdmin) {
    redirect("/unauthorized");
  }

  // ✅ Authorized → render the page
  return <main>{children}</main>;
}
```

---

### B) Protecting API Routes

API routes should return HTTP status codes, not redirects.

**Pattern for Admin-Only Routes:**
```typescript
// src/app/api/admin/something/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();

  // Step 1: Check authentication
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }  // ← Unauthorized
    );
  }

  // Step 2: Check authorization (role)
  const isAdmin = session.user.role === 'admin' || session.user.role === 'superAdmin';
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required' }, 
      { status: 403 }  // ← Forbidden
    );
  }

  // Step 3: Your business logic here
  // ...
}
```

**Pattern for Authenticated User Routes (with onboarding check):**
```typescript
// src/app/api/voting/[episodeId]/paper/route.ts
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Important: Many routes require onboarding to be complete
  if (!session.user.onboardingComplete) {
    return NextResponse.json({ error: 'Onboarding required' }, { status: 403 });
  }

  // Continue with the route...
}
```

**Pattern for Public Routes (with optional auth enhancement):**
```typescript
// src/app/api/voting/active/route.ts
export async function GET(request: NextRequest) {
  const session = await auth();  // ← Still call auth(), but don't block
  
  // Return data even if not logged in
  // But enhance the response if they ARE logged in
  if (session?.user?.id) {
    // Add user-specific data
  }
  
  return NextResponse.json({ ... });
}
```

---

### Quick Decision Guide: Is This Route Protected?

Ask yourself:

| Question | If Yes | If No |
|----------|--------|-------|
| **Does viewing it require login?** | Add `if (!session?.user)` check | Make it public |
| **Is it for admins only?** | Check `session.user.role` | Skip role check |
| **Requires onboarding complete?** | Check `session.user.onboardingComplete` | Skip the check |
| **Is it a page or API?** | Page = `redirect()` <br> API = return status code | N/A |

---

<a name="rbac"></a>
## 6. Role-Based Access Control (RBAC)

### The Three Roles

| Role | Can Do |
|------|--------|
| `user` | Vote, view results they voted on, manage their account |
| `admin` | Everything `user` can do + create drafts, edit content |
| `superAdmin` | Everything `admin` can do + publish, close votes, manage admins |

### Helper Functions

Create utility functions to make role checks cleaner:

```typescript
// You can add these to a utils file
function isAdmin(role: string | undefined): boolean {
  return role === 'admin' || role === 'superAdmin';
}

function isSuperAdmin(role: string | undefined): boolean {
  return role === 'superAdmin';
}

// Usage in an API route:
if (!isAdmin(session.user.role)) {
  return NextResponse.json({ error: 'Admin required' }, { status: 403 });
}
```

---

<a name="cross-subdomain"></a>
## 7. Cross-Subdomain Auth

This site has two subdomains that share the same auth:
- `sharpsighted.studio` (main site)
- `ros.sharpsighted.studio` (RoS voting site)

### How It Works

In `auth.ts`, cookies are configured with:
```typescript
const cookieDomain = '.sharpsighted.studio';  // Note the leading dot!

cookies: {
  sessionToken: {
    options: {
      domain: cookieDomain,  // Cookie shared across all subdomains
      // ...
    }
  }
}
```

The leading dot (`.sharpsighted.studio`) means the cookie is valid for:
- `sharpsighted.studio`
- `ros.sharpsighted.studio`
- Any other `*.sharpsighted.studio`

### Local Development

For local dev, we use:
```typescript
const cookieDomain = isDev ? '.sharpsighted.local' : '.sharpsighted.studio';
```

You'll need to add entries to `/etc/hosts`:
```
127.0.0.1  sharpsighted.local
127.0.0.1  ros.sharpsighted.local
```

---

<a name="quick-reference"></a>
## 8. Quick Reference – Code Patterns

### Import Statement
```typescript
import { auth } from '@/auth';
```

### Check If Logged In (API Route)
```typescript
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Auth required' }, { status: 401 });
}
```

### Check If Admin (API Route)
```typescript
const isAdmin = session.user.role === 'admin' || session.user.role === 'superAdmin';
if (!isAdmin) {
  return NextResponse.json({ error: 'Admin required' }, { status: 403 });
}
```

### Check If SuperAdmin (API Route)
```typescript
if (session.user.role !== 'superAdmin') {
  return NextResponse.json({ error: 'SuperAdmin required' }, { status: 403 });
}
```

### Redirect If Not Logged In (Page)
```typescript
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function ProtectedPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  // ...
}
```

### Redirect If Already Logged In (Login Page)
```typescript
export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');
  // ...
}
```

### Get User Data in Client Component
```typescript
'use client';
import { useSession } from 'next-auth/react';

export function Profile() {
  const { data: session } = useSession();
  return <p>Hello {session?.user?.displayName}</p>;
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/auth.ts` | Main NextAuth configuration |
| `src/app/api/auth/[...nextauth]/route.ts` | API route handler (just re-exports) |
| `src/types/next-auth.d.ts` | TypeScript type extensions |
| `src/components/providers/AuthProvider.tsx` | Wraps app with SessionProvider |
| `src/app/layout.tsx` | Where AuthProvider is mounted |
| `src/app/dashboard/layout.tsx` | Example of protected layout |
| `src/lib/db/user.ts` | User database operations |

---

## Environment Variables Required

```bash
# Database
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_SECRET=your-random-secret-here

# Email (Magic Link)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=no-reply@sharpsighted.studio

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Common Gotchas (all devs feel free to add to this if you run into something)

1. **"session is null in API route"** – Make sure you're calling `await auth()`, not just `auth()`
2. **"Property 'role' doesn't exist on session.user"** – Check that `src/types/next-auth.d.ts` exists
3. **"Cookie not sharing between subdomains"** – Check that domain starts with a dot: `.sharpsighted.studio`
4. **"User stuck on onboarding"** – The JWT caches `onboardingComplete`. User may need to sign out/in to refresh.
