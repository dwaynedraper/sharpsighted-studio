# RoS Admin Screens and Forms Spec

This document defines the admin UX for creating and managing Episodes, Votes, Options, and Results.
If implementation adds fields or changes behavior, update this file first.

## 0) Access and shells
- Admin routes exist on both subdomains, same capabilities, different shell.
- All admin routes require:
  - authenticated user
  - onboarding complete
  - role: admin or superAdmin
- SuperAdmin-only:
  - user management and role changes (already implemented)

## 1) Admin navigation (minimum)
- `/dashboard` (home)
- `/dashboard/content` (content hub)
- `/dashboard/content/new` (create)
- `/dashboard/content/[id]` (edit and manage)
- Optional shortcut:
  - `/dashboard/ros` (RoS hub, filtered view)

## 2) Content hub screen
Route: `/dashboard/content`

Purpose:
- Single list for posts, episodes, votes
- Filterable, sortable, with quick actions

UI requirements:
- Tabs or filters:
  - Type: BlogPosts | Episodes | Votes
  - Status: draft | published | closed | archived (where applicable)
  - Tag (blog only): sss | ros
  - Episode (votes only): All | specific episode
- Table columns
  - Type
  - Title
  - Status / Phase (votes show both)
  - Episode (if vote)
  - UpdatedAt
  - Quick actions

Quick actions:
- Edit
- Publish (if eligible)
- Close (votes only, if eligible)
- Archive (soft)
- View public page (for published items)

## 3) Create screen
Route: `/dashboard/content/new`

Purpose:
- Entry point to create:
  - Blog post
  - Episode (RoS)
  - Vote (RoS or other)

UI requirements:
- First step: choose content type
- Then render the correct creation form
- After creation, redirect to `/dashboard/content/[id]`

## 4) Episode editor
Route: `/dashboard/content/[episodeId]` when type=episode

### 4a) Fields (Episode base)
- title (required)
- slug (required, unique)
- episodeNumber (optional integer)
- summary (optional)
- contentMarkdown (required)
- status (draft | published | archived)
- isCurrent (boolean)

### 4b) Fields (Episode ros block)
Meta:
- ros.operationTitle (optional)
- ros.pollUrl (optional, URL)
- ros.hook (optional, short text)

Paper (populated after paper vote finalization):
- ros.paper.paperName (optional)
- ros.paper.identityMarkdown (optional markdown)
- ros.paper.nightmareMarkdown (optional markdown)
- ros.paper.handicapMarkdown (optional markdown)

Results (ObjectId references, set after votes close):
- ros.results.winningPaperOptionId (ObjectId | null)
- ros.results.winningBenchmarkOptionId (ObjectId | null)
- ros.results.winningTrapOptionId (ObjectId | null)
- ros.results.winningRidiculousOptionId (ObjectId | null)

Cover image:
- coverImage.cloudinaryPublicId (optional)
- coverImage.alt (optional)

### 4c) Episode editor layout
Top header:
- Title, status badge, last updated
- Buttons:
  - Save draft
  - Publish
  - Archive
  - View public page (if published)

Sections:
1. Meta data
2. RoS meta (operation title, poll url, hook)
3. Paper block
4. Results block
5. Content markdown editor
6. Related votes (list, create new vote pre-linked)

### 4d) Episode validations
- title required
- slug required, unique
- slug format: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- if isCurrent set true:
  - application must unset isCurrent on any other episode (atomic best-effort)
- publish rules:
  - allow publish even if votes not complete
  - do not require paper/results fields to publish

## 5) Vote editor
Route: `/dashboard/content/[voteId]` when type=vote

### 5a) Vote fields
- type enum:
  - paperSelection
  - benchmark
  - trap
  - ridiculous
  - other
- title (required)
- slug (required, unique)
- descriptionMarkdown (optional)
- episodeId (optional ObjectId)
- status enum: draft | published | archived
- phase enum: collecting | voting | closed
- visibility:
  - canView: public (default public)
  - canVote: authenticated (always requires auth + onboarding)
- timing:
  - opensAt (optional)
  - endsAt (optional)
  - manualCloseEnabled (default true)

Constraints:
- constraints.resultsHiddenUntilVoted (boolean, default true)
- constraints.allowUserOptions (boolean, default false)
- constraints.maxUserSubmissions (number, default 0)
- constraints.singleChoiceOnly (boolean, always true)

Admin metadata:
- publishedByUserId, publishedAt
- closedByUserId, closedAt

### 5b) Vote editor layout
Top header:
- Title, status badge, phase badge
- Buttons (enabled by state):
  - Save
  - Publish
  - Set phase: Collecting / Voting (only for ridiculous)
  - Close
  - Archive
  - View on /voting (link)

Sections:
1. Vote basics (type, title, slug, episode linkage)
2. Description markdown
3. Timing and visibility
4. Options manager
5. Results preview (admin-only)
6. Audit trail preview (optional later)

### 5c) Vote state rules
Draft:
- Visible only in dashboard
- Can edit everything
Published:
- Appears on /voting
- Options editing rules:
  - For normal votes (paperSelection, benchmark, trap, other):
    - allow editing option label/description order
    - do not allow deleting options if ballots exist
  - For ridiculous:
    - during collecting:
      - allow user submissions (via public API)
      - admin can remove abusive entries (soft disable option)
    - during voting:
      - lock option creation except admin manual add (optional)
Closed:
- No ballots accepted
- Admin can finalize winner and optionally sync to episode results
Archived:
- Hidden from /voting, remains in db

### 5d) Vote validations
- title required
- slug required, unique
- type required
- phase defaults:
  - paperSelection/benchmark/trap/other => voting
  - ridiculous => collecting
- publishing rules:
  - must have at least 2 active options unless type=ridiculous in collecting
  - if timing.opensAt/endsAt used, opensAt < endsAt
- closing rules:
  - allowed if status=published and phase=voting (or collecting if you want to kill it)
  - sets closedAt, closedByUserId
- results storage:
  - if using voteResults, compute on close or on demand

## 6) Vote options manager
Part of Vote editor (inline)

### 6a) Default option slots
- For paperSelection/benchmark/trap:
  - render 3 option rows by default
  - plus “Add option” button
- For nightmare trap weeks:
  - allow up to 5 options
- For other votes:
  - default 2 options, allow add

### 6b) Option fields
- label (required)
- description (optional)
- image.cloudinaryPublicId (optional)
- image.alt (optional)
- order (optional)
- isActive (default true)

Trap-specific:
- trap (optional string, the rejection rule copy)

Eligibility (for nightmare-only options):
- eligibility.minRosBallotsCast (optional number)
- flags.isNightmare (optional boolean)

Ridiculous user submissions:
- flags.isUserSubmitted (boolean)
- createdByUserId (ObjectId)
- attributionDisplayName (string snapshot)

### 6c) Option validations
- label required
- label max length:
  - standard votes: 80 chars recommended
  - ridiculous user-submitted: hard cap 120 chars
- allow spaces, letters, numbers, punctuation in labels
- soft delete behavior:
  - never hard delete options if ballots exist
  - disable via isActive=false instead

## 7) Public-side APIs needed for voting system
These are non-admin APIs that support /voting.

### 7a) List active votes
GET `/api/voting/active`
Returns:
- open votes sorted by priority (paperSelection, benchmark, trap, ridiculous, other)
- include options (filtered to active)
- include userHasVoted boolean if authed
- include results only if userHasVoted

### 7b) Submit ballot
POST `/api/voting/[voteId]/ballot`
Body:
- optionId
Rules:
- auth required
- onboarding complete required
- vote must be published and phase=voting
- one ballot per user per vote
- enforce eligibility.minRosBallotsCast if present

### 7c) Ridiculous submission
POST `/api/voting/[voteId]/options`
Body:
- label (<=120)
Rules:
- auth required
- onboarding complete required
- vote.type=ridiculous
- vote.phase=collecting
- vote.status=published
- total user-submitted options < maxUserSubmissions (default 5)

## 8) Admin-only APIs needed for vote lifecycle
### 8a) Create episode
POST `/api/admin/episodes`
### 8b) Update episode
PATCH `/api/admin/episodes/[id]`
### 8c) Create vote
POST `/api/admin/votes`
### 8d) Update vote
PATCH `/api/admin/votes/[id]`
### 8e) Publish vote
POST `/api/admin/votes/[id]/publish`
### 8f) Change vote phase (ridiculous only)
POST `/api/admin/votes/[id]/set-phase` body { phase }
### 8g) Close vote
POST `/api/admin/votes/[id]/close`
### 8h) Finalize vote winner and sync to episode
POST `/api/admin/votes/[id]/finalize` body { winningOptionId, syncToEpisode: boolean }

All admin APIs:
- require auth
- require onboarding complete
- require role admin/superAdmin

## 9) Audit logging (minimum)
Create audit events on:
- EPISODE_CREATED
- EPISODE_UPDATED
- EPISODE_PUBLISHED
- VOTE_CREATED
- VOTE_UPDATED
- VOTE_PUBLISHED
- VOTE_PHASE_CHANGED
- VOTE_CLOSED
- VOTE_FINALIZED
- VOTE_OPTION_DISABLED (when isActive=false for moderation)

Metadata should include:
- episodeId/voteId
- type
- previousStatus/nextStatus or previousPhase/nextPhase
- winningOptionId when finalized

## 10) MVP UI styling expectations
- Voting pages can be functional.
- Episode evergreen pages must be “stunning”.
- Admin pages can be utilitarian but must be fast and clear.
- Desktop-first for admin.