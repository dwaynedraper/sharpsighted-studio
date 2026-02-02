# Sharp Sighted Studio — Architecture Guide

> **For new developers**: This is your onboarding document. It explains how the system links together without going too deep into implementation details.

---

## 1. What Is This?

Sharp Sighted Studio is a **single Next.js 16 application** that serves two subdomains:

| Subdomain | Purpose |
|-----------|---------|
| `sharpsighted.studio` | Main site — community, blog, tutorials |
| `ros.sharpsighted.studio` | **Ripped or Stamped** — a high-stakes print challenge with voting |

Both subdomains share:
- **One codebase** (this repo)
- **One database** (MongoDB)
- **One auth system** (NextAuth v5 with JWT)
- **One deployment** (subdomain routing happens in Next.js)

---

## 2. Key Technologies

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Auth** | NextAuth v5 with JWT strategy |
| **Database** | MongoDB Atlas + `mongodb` driver |
| **Styling** | Sass (`.scss`) + Tailwind utilities |
| **Animation** | Framer Motion (micro) + GSAP (reveals) |
| **Images** | Cloudinary (upload originals, transform on delivery) |
| **Email** | Resend (magic link login) |

---

## 3. Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── admin/                # Admin-only APIs
│   │   └── voting/               # Voting APIs
│   ├── dashboard/                # Admin pages (protected)
│   ├── login/, signup/, onboarding/
│   ├── voting/, challenges/, rules/  # RoS content pages
│   └── layout.tsx                # Root layout (wraps everything)
│
├── components/
│   ├── main/                     # Main site shell & components
│   │   ├── MainShell.tsx         # Wraps main subdomain pages
│   │   ├── MainNav.tsx           # Main site navigation
│   │   └── MainHomePage.tsx      # Main homepage content
│   ├── ros/                      # RoS subdomain shell & components
│   │   ├── RosShell.tsx          # Wraps RoS pages
│   │   ├── RosNav.tsx            # RoS navigation
│   │   └── RosHomePage.tsx       # RoS homepage content
│   ├── admin/                    # Admin-specific components
│   ├── auth/                     # Auth forms (login, onboarding)
│   ├── providers/                # React context providers
│   └── ui/                       # Shared UI components
│
├── lib/
│   └── db/                       # Database operations
│       ├── mongodb.ts            # Connection singleton
│       ├── user.ts               # User CRUD
│       ├── episode.ts            # Episode/voting CRUD
│       ├── ballot.ts             # Vote ballot operations
│       └── audit.ts              # Audit logging
│
├── types/                        # TypeScript types
│   ├── next-auth.d.ts            # Session type extensions
│   └── voting.ts                 # Voting system types
│
├── auth.ts                       # NextAuth configuration (core!)
└── proxy.ts                      # Edge middleware (route protection)
```

---

## 4. How Subdomain Routing Works

The app determines which subdomain it's on by reading the `host` header:

```tsx
// src/app/layout.tsx
const host = headersList.get('host') || '';
const isRosHost = host.startsWith('ros.');
const Shell = isRosHost ? RosShell : MainShell;
```

Each shell provides its own:
- Navigation bar
- Visual styling (RoS uses "blueprint" theme)
- Shell-specific floating components

---

## 5. Authentication Flow

See [AUTH_README.md](./AUTH_README.md) for the complete auth guide.

**TL;DR:**
- Users sign in via **magic link** (email) or **Google OAuth**
- Session stored as **JWT in a cookie**
- Cookie domain is `.sharpsighted.studio` (shared across subdomains)
- After first login, users must complete **onboarding** (firstName + displayName)

**Protecting routes:**
- **Pages**: Use `redirect()` from `next/navigation`
- **APIs**: Return 401/403 status codes

---

## 6. Role System

| Role | Can Do |
|------|--------|
| `user` | Vote, view results they voted on |
| `admin` | Create/edit drafts, manage content |
| `superAdmin` | Publish, close votes, manage admins |

Check roles in API routes:
```typescript
const session = await auth();
if (session?.user?.role !== 'admin' && session?.user?.role !== 'superAdmin') {
  return NextResponse.json({ error: 'Admin required' }, { status: 403 });
}
```

---

## 7. Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | User accounts, roles, preferences |
| `accounts` | OAuth provider links (NextAuth) |
| `episodes` | RoS episodes (paper options, traps, benchmarks) |
| `ballots` | User votes per episode |
| `auditLogs` | All sensitive actions (append-only) |

---

## 8. Voting System (RoS)

Each RoS episode has a lifecycle:

```
draft → paper_voting → challenges_voting → closed
```

**Paper voting**: Users vote for which paper I'll use for the print.  
**Challenges voting**: Users vote on traps/benchmarks I must follow.

Votes are:
- One per user per phase
- Cannot be changed after submission
- Results hidden until user votes

---

## 9. Environment Variables

Required in `.env.local`:

```bash
# Database
MONGODB_URI=...

# Auth
AUTH_SECRET=...

# Email (magic link)
EMAIL_SERVER_HOST=...
EMAIL_SERVER_PORT=...
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
EMAIL_FROM=...

# Site URLs (for cross-subdomain links)
NEXT_PUBLIC_ROS_URL=http://ros.sharpsighted.local:3001
NEXT_PUBLIC_MAIN_SITE_URL=http://sharpsighted.local:3001
```

---

## 10. Local Development Setup

1. **Add to `/etc/hosts`:**
   ```
   127.0.0.1  sharpsighted.local
   127.0.0.1  ros.sharpsighted.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Access:**
   - Main: `http://sharpsighted.local:3001`
   - RoS: `http://ros.sharpsighted.local:3001`

---

## 11. Key Files to Know

| File | Why It Matters |
|------|----------------|
| `src/auth.ts` | All auth configuration lives here |
| `src/proxy.ts` | Edge middleware for route protection |
| `src/app/layout.tsx` | Root layout, subdomain detection |
| `src/lib/db/mongodb.ts` | Database connection singleton |
| `AGY/*.md` | Specification docs (source of truth) |

---

## 12. AGY Folder = The Spec

The `AGY/` folder contains the project specifications:

| File | Contents |
|------|----------|
| `00_MASTER_RULES.md` | Non-negotiable rules |
| `01_SITE_MAP.md` | All routes and access levels |
| `02_DATA_MODELS.md` | Database schemas |
| `03_AUTH_AND_ROLES.md` | Auth system spec |
| `06_RoS_LIFECYCLE.md` | Voting phase transitions |

**If the code conflicts with AGY docs, the docs win.** Ask before deviating.

---

## 13. Common Tasks

### Add a new page
1. Create `src/app/[your-route]/page.tsx`
2. Add to `AGY/01_SITE_MAP.md`
3. Add to `src/proxy.ts` if it needs protection

### Add a new API route
1. Create `src/app/api/[your-route]/route.ts`
2. Use `await auth()` for session
3. Return proper status codes (401, 403, 404, etc.)

### Change database schema
1. Update `AGY/02_DATA_MODELS.md` first
2. Update TypeScript types in `src/types/`
3. Update `src/lib/db/` functions

---

## Questions?

Ask the team or consult the AGY docs. When in doubt, check `00_MASTER_RULES.md`.
