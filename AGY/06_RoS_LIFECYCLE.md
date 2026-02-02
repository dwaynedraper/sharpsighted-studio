# RoS Lifecycle Spec (Episode + Voting)

This is the canonical lifecycle for Ripped or Stamped.
If implementation changes the behavior, update this file first.

## 0) Key concepts
- **Episode** is the canonical evergreen page (`/challenges/[slug]`).
- **Votes** are time-bound interaction objects shown on `/voting`.
- **VoteOptions** are the selectable options inside a Vote.
- **Ballots** are immutable user selections (one ballot per user per vote).

## 1) Required vote types for a normal episode
Minimum set:
- `paperSelection` (choose the paper)
- `benchmark` (choose the benchmark challenge)
- `trap` (choose the trap challenge)

Optional:
- `ridiculous` (collect user entries, then vote on best one)
- `other` (misc engagement votes not tied to the episode)

## 2) Episode creation flow (Admin)
1. Create Episode as `draft`
   - Set: `title`, `slug`, `episodeNumber`, `summary`, `contentMarkdown`
   - Set: `ros.operationTitle`, `ros.hook`, optional `ros.pollUrl`
   - Leave `ros.paper.*` empty until paper is selected
   - Set `isCurrent = true` if this is the active episode
2. Ensure only one Episode has `isCurrent = true`
3. Publish Episode only when the evergreen page is ready
   - `status = published`
   - set `publishedAt`, `publishedByUserId`

## 3) Paper selection vote (Admin)
1. Create Vote: type = `paperSelection`, episodeId = this episode
   - `status = draft`
   - `phase = voting`
   - `visibility.canView = public`
   - `visibility.canVote = authenticated`
   - `constraints.resultsHiddenUntilVoted = true`
2. Create VoteOptions (default 3) for paper candidates
3. Publish Vote
   - `status = published`
   - set `publishedAt`, `publishedByUserId`
4. Users vote (Ballots created)
5. Close Vote
   - set `phase = closed`
   - set `closedAt`, `closedByUserId`
6. Finalize winner
   - Determine winning option by ballot count
   - Write to Episode:
     - `ros.results.winningPaperOptionId = <voteOptionId>`
     - `ros.paper.paperName`, `ros.paper.identityMarkdown`, `ros.paper.nightmareMarkdown`, `ros.paper.handicapMarkdown`
   - If using `voteResults`, compute and store results

## 4) Benchmark vote (Admin)
1. Create Vote: type = `benchmark`, episodeId = this episode
   - `status = draft`
   - `phase = voting`
2. Create VoteOptions (default 3)
3. Publish Vote
4. Users vote
5. Close Vote
6. Finalize winner
   - Write to Episode:
     - `ros.results.winningBenchmarkOptionId = <voteOptionId>`
   - Optionally compute `voteResults`

## 5) Trap vote (Admin)
1. Create Vote: type = `trap`, episodeId = this episode
   - `status = draft`
   - `phase = voting`
2. Create VoteOptions (default 3)
   - Traps can be 5 on nightmare weeks
   - Each trap option may include `trap` text (the “Board rejection” rule)
3. Optional nightmare-only trap options
   - Mark `voteOptions.flags.isNightmare = true`
   - Set `voteOptions.eligibility.minRosBallotsCast = 3`
4. Publish Vote
5. Users vote (eligibility enforced server-side)
6. Close Vote
7. Finalize winner
   - Write to Episode:
     - `ros.results.winningTrapOptionId = <voteOptionId>`
   - Optionally compute `voteResults`

## 6) Ridiculous vote (Collect then vote)
Purpose: user-submitted options (max 5), then a vote selects the best.

### 6a) Collecting phase
1. Create Vote: type = `ridiculous`, episodeId = this episode
   - `status = draft`
   - `phase = collecting`
   - `constraints.allowUserOptions = true`
   - `constraints.maxUserSubmissions = 5`
   - `constraints.resultsHiddenUntilVoted = true`
2. Publish Vote
3. Authenticated + onboarded users may submit a VoteOption
   - `label` max 120 chars
   - `flags.isUserSubmitted = true`
   - `createdByUserId` set
   - `attributionDisplayName` set snapshot
4. Stop collecting when:
   - submissions reach 5, or
   - admin manually ends collection

### 6b) Voting phase
5. Admin transitions vote to voting:
   - set `phase = voting`
   - audit action `VOTE_PHASE_CHANGED`
6. Users vote (Ballots created, one per user)
7. Close Vote
8. Finalize winner
   - Write to Episode:
     - `ros.results.winningRidiculousOptionId = <voteOptionId>` (optional)
   - Optionally compute `voteResults`

## 7) Voting page rules (`/voting`)
Order of content:
1. Active votes (published + currently open)
   - A vote is "open" when:
     - `status = published`
     - `phase = voting` OR `phase = collecting`
     - and (if timing used) now is within opensAt/endsAt
2. Most recent episode summary block (from `episodes.isCurrent = true`)
   - Paper selected
   - Challenges selected
   - Examples from shoots (no “final chosen” photo)

Results visibility:
- If user has NOT voted in that vote:
  - show options and CTA to vote
  - hide counts and leading status
- If user HAS voted:
  - show counts and percentages
  - show “you voted for X”
- If vote `phase = closed`:
  - still honor resultsHiddenUntilVoted unless you explicitly override later

## 8) Ballot creation rules (API)
When creating a ballot:
- Require authenticated user
- Require onboarding complete
- Require vote.status = published
- Require vote.phase = voting
- Enforce one ballot per user per vote (unique index)
- Enforce option eligibility:
  - If option.eligibility.minRosBallotsCast exists:
    - user.rosStats.ballotsCast must be >= that value
- Ballots are immutable once created

## 9) User stats updates (recommended)
After a ballot is successfully created:
- Increment `users.rosStats.ballotsCast += 1`
- Set `users.rosStats.lastBallotAt = now`

This enables fast gating for nightmare options without scanning ballots.

## 10) Admin capabilities
- Admin and SuperAdmin can create and manage Episodes, Votes, VoteOptions.
- Only SuperAdmin can manage user roles.
- Admin actions should create audit entries:
  - `VOTE_PUBLISHED`
  - `VOTE_PHASE_CHANGED`
  - `VOTE_CLOSED`
  - `EPISODE_PUBLISHED`

## 11) Status and phase conventions
Episode:
- `draft` = not visible publicly
- `published` = visible on `/challenges/[slug]`
- `archived` = hidden from listings

Vote:
- `status` controls visibility in UI:
  - `draft` = not visible publicly
  - `published` = visible on `/voting`
  - `archived` = hidden
- `phase` controls what interactions are allowed:
  - `collecting` = accept user-submitted options only
  - `voting` = accept ballots
  - `closed` = no interaction, results can be finalized