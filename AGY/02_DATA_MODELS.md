# MongoDB Data Models and Indexes

This document defines the MongoDB collections, fields, relationships, and required indexes.
If a feature needs data not listed here, update this file before implementing.

## 0) Global conventions
- Use ObjectId `_id` for primary keys.
- Store timestamps as ISO Date:
  - `createdAt`, `updatedAt`
- Never hard delete. Use soft states:
  - `deactivatedAt`
  - `suspendedUntil`
  - `archivedAt`
  - `closedAt`
- Normalize unique strings for indexing with a lowercase field.

## 1) users
Purpose: canonical user identity, onboarding status, roles, preferences.

### Document
- `_id` ObjectId
- `email` string (required, lowercased)
- `emailVerifiedAt` Date | null
- `firstName` string | null
- `displayName` string | null
- `displayNameLower` string | null
- `displayNameChangedAt` Date | null
- `role` enum: `user` | `admin` | `superAdmin` (default `user`)
- `status`
  - `isActive` boolean (default true)
  - `deactivatedAt` Date | null
  - `suspendedUntil` Date | null
- `onboarding`
  - `isComplete` boolean (default false)
  - `completedAt` Date | null
- `preferences`
  - `theme` enum: `light` | `dark` | `system` (default `system`)
  - `accent` string (hex or token id)
- `rosStats` (optional, recommended for gating performance)
  - `ballotsCast` number (default 0)
  - `lastBallotAt` Date | null
- `createdAt` Date
- `updatedAt` Date

### Indexes
- Unique: `{ email: 1 }`
- Unique (sparse): `{ displayNameLower: 1 }`
  - Enforces site-wide display name uniqueness.
  - Only applies when `displayNameLower` exists.
- Optional for admin ops:
  - `{ role: 1, "status.isActive": 1 }`
  - `{ "status.suspendedUntil": 1 }`

### Rules
- Onboarding required after email verification:
  - `firstName` and `displayName` must be collected.
  - `onboarding.isComplete` gates all authenticated actions except allowed routes.
- Display name change lockout:
  - User can change display name only if:
    - new `displayNameLower` is available
    - at least 90 days have passed since `displayNameChangedAt`
  - On change: update `displayNameChangedAt` to now.

## 2) authAccounts (if using Auth.js adapter)
Purpose: store OAuth provider links and ensure merge-by-email without duplicates.

### Document (conceptual, adapter-managed)
- `_id` ObjectId
- `userId` ObjectId (ref users._id)
- `provider` string (e.g. `google`)
- `providerAccountId` string
- tokens as required by adapter
- `createdAt`, `updatedAt`

### Indexes
- Unique: `{ provider: 1, providerAccountId: 1 }`
- `{ userId: 1 }`

### Rules
- Never create duplicate users for the same verified email.
- Link providers only for verified emails.

## 3) sessions (adapter-managed)
Purpose: sessions when using database strategy. If using JWT strategy, adapter may not rely on this.

### Indexes
- `{ userId: 1 }`
- Unique `{ sessionToken: 1 }` (adapter)

## 4) blogPosts
Purpose: shared blog system for both SSS and RoS tagged content. Canonical routes live on main.

### Document
- `_id` ObjectId
- `title` string (required)
- `slug` string (required, unique)
- `summary` string | null
- `contentMarkdown` string (required)
- `tags` array of strings (allowed: `sss`, `ros`, plus future tags)
- `status` enum: `draft` | `published` | `archived`
- `authorUserId` ObjectId (ref users._id)
- `draftedByUserId` ObjectId (ref users._id)
- `publishedByUserId` ObjectId | null (ref users._id)
- `publishedAt` Date | null
- `heroImage`
  - `cloudinaryPublicId` string | null
  - `alt` string | null
- `createdAt` Date
- `updatedAt` Date
- `archivedAt` Date | null

### Indexes
- Unique: `{ slug: 1 }`
- `{ status: 1, publishedAt: -1 }`
- `{ tags: 1, status: 1, publishedAt: -1 }`

## 5) episodes
Purpose: first-class RoS episode archive and evergreen “final result” page.

### Document
- `_id` ObjectId
- `title` string (required)
- `slug` string (required, unique)
- `episodeNumber` number | null
- `summary` string | null
- `contentMarkdown` string (required)
- `status` enum: `draft` | `published` | `archived`
- `isCurrent` boolean (default false)

- `ros` (structured RoS metadata + outcomes)
  - `operationTitle` string | null
  - `pollUrl` string | null
  - `hook` string | null

  - `paper`
    - `paperName` string | null
    - `identityMarkdown` string | null
    - `nightmareMarkdown` string | null
    - `handicapMarkdown` string | null

  - `results`
    - `winningPaperOptionId` ObjectId | null (ref voteOptions._id)
    - `winningBenchmarkOptionId` ObjectId | null (ref voteOptions._id)
    - `winningTrapOptionId` ObjectId | null (ref voteOptions._id)
    - `winningRidiculousOptionId` ObjectId | null (ref voteOptions._id)

- `coverImage`
  - `cloudinaryPublicId` string | null
  - `alt` string | null
- `publishedByUserId` ObjectId | null
- `publishedAt` Date | null
- `createdAt` Date
- `updatedAt` Date
- `archivedAt` Date | null

### Indexes
- Unique: `{ slug: 1 }`
- `{ status: 1, publishedAt: -1 }`
- `{ isCurrent: 1 }` (ensure only one current via application rule)

### Rules
- Enforce only one `isCurrent: true` at a time in app logic.

## 6) votes
Purpose: define a vote container. Single-choice. Supports standard voting and “collect then vote” for Ridiculous.

### Document
- `_id` ObjectId
- `type` enum:
  - `paperSelection`
  - `benchmark`
  - `trap`
  - `ridiculous`
  - `other`
- `title` string (required)
- `slug` string (required, unique)
- `descriptionMarkdown` string | null
- `episodeId` ObjectId | null (ref episodes._id)

- `status` enum: `draft` | `published` | `archived`
  - `published` means visible on `/voting`
- `phase` enum: `collecting` | `voting` | `closed`
  - `collecting` accepts user-submitted options (ridiculous only)
  - `voting` accepts ballots
  - `closed` means results can be finalized

- `visibility`
  - `canView` enum: `public` (default public)
  - `canVote` enum: `authenticated` (requires auth + onboarding)

- `constraints` (optional per vote)
  - `allowUserOptions` boolean (default false)
  - `maxUserSubmissions` number | null
    - For Ridiculous: 5
  - `resultsHiddenUntilVoted` boolean (default true)

- `timing`
  - `opensAt` Date | null
  - `endsAt` Date | null
  - `manualCloseEnabled` boolean (default true)

- `publishedByUserId` ObjectId | null
- `publishedAt` Date | null
- `closedByUserId` ObjectId | null
- `closedAt` Date | null
- `createdAt` Date
- `updatedAt` Date
- `archivedAt` Date | null

### Indexes
- Unique: `{ slug: 1 }`
- `{ status: 1, phase: 1, "timing.opensAt": 1, "timing.endsAt": 1 }`
- `{ episodeId: 1, status: 1, phase: 1 }`

### Rules
- Single choice only.
- Vote changing is not allowed.
- Results visibility:
  - Votes are visible to everyone.
  - Results are hidden until the user has voted.
- Phase enforcement:
  - Ballots only allowed when `phase = voting`.
  - User-submitted options only allowed when `phase = collecting` AND `constraints.allowUserOptions = true`.

## 7) voteOptions
Purpose: selectable options for a vote, including admin-created challenges and user-submitted Ridiculous entries.

### Document
- `_id` ObjectId
- `voteId` ObjectId (ref votes._id)
- `label` string (required)
- `description` string | null
- `trap` string | null
  - Only used for `vote.type = trap`
  - This is the “trap” rule text shown under the challenge

- `image`
  - `cloudinaryPublicId` string | null
  - `alt` string | null

- `createdByUserId` ObjectId | null
  - For Ridiculous user entries, this is the submitting user.
- `attributionDisplayName` string | null
  - Snapshot of the user display name at time of submission for attribution.

- `eligibility` (optional gating per option)
  - `minRosBallotsCast` number | null
    - For nightmare-only choices: 3
  - `rolesAllowed` array of `user` | `admin` | `superAdmin` | null

- `flags`
  - `isNightmare` boolean (default false)
  - `isUserSubmitted` boolean (default false)

- `order` number | null
- `isActive` boolean (default true)
- `createdAt` Date
- `updatedAt` Date

### Indexes
- `{ voteId: 1, order: 1 }`
- `{ voteId: 1, isActive: 1 }`
- `{ voteId: 1, "flags.isUserSubmitted": 1 }`

### Rules
- Nightmares:
  - `flags.isNightmare = true` options may require `eligibility.minRosBallotsCast = 3`.
- Ridiculous submission:
  - Only allow option creation if:
    - vote type is `ridiculous`
    - vote status is `published`
    - vote phase is `collecting`
    - vote `constraints.allowUserOptions = true`
    - submission count for that vote is < `constraints.maxUserSubmissions` (5)
    - user is authenticated and onboarding complete
  - Custom entry length:
    - hard cap 120 characters server-side
    - enforce visually client-side too

## 8) ballots
Purpose: record a user’s single-choice vote. Must be one per user per vote.

### Document
- `_id` ObjectId
- `voteId` ObjectId (ref votes._id)
- `userId` ObjectId (ref users._id)
- `optionId` ObjectId (ref voteOptions._id)
- `createdAt` Date

### Indexes
- Unique: `{ voteId: 1, userId: 1 }` (enforces one vote per user per vote)
- `{ optionId: 1 }`
- `{ userId: 1, createdAt: -1 }`

### Rules
- Ballots cannot be updated. Create once, immutable.
- Eligibility enforcement:
  - When creating a ballot, validate that the chosen `voteOption.eligibility` is satisfied for that user.

## 9) voteResults (optional materialized results)
Purpose: cache counts after close or for fast reads.

Use only if needed for performance. Otherwise compute from ballots.

### Document
- `_id` ObjectId
- `voteId` ObjectId (ref votes._id)
- `computedAt` Date
- `totals`
  - array of `{ optionId, count }`
- `totalBallots` number

### Indexes
- Unique: `{ voteId: 1 }`

## 10) auditLog (recommended)
Purpose: immutable admin and super admin actions for safety and debugging.

### Document
- `_id` ObjectId
- `actorUserId` ObjectId
- `actorRole` string
- `action` string
  - examples:
    - `ADMIN_CREATED`
    - `ROLE_CHANGED`
    - `VOTE_PUBLISHED`
    - `VOTE_PHASE_CHANGED`
    - `VOTE_CLOSED`
    - `EPISODE_PUBLISHED`
    - `DISPLAYNAME_CHANGED`
- `entityType` string
- `entityId` ObjectId | string
- `metadata` object (small, no secrets)
- `createdAt` Date

### Indexes
- `{ actorUserId: 1, createdAt: -1 }`
- `{ entityType: 1, entityId: 1, createdAt: -1 }`