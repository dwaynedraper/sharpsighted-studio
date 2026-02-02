import { ObjectId } from 'mongodb';

// ==================== EPISODE STATUS ====================

export type EpisodeStatus = 'paper_voting' | 'challenges_voting' | 'closed' | 'archived';

// ==================== PAPER OPTION ====================

export interface PaperOption {
    id: string; // nanoid
    name: string;
    weight: string; // e.g., "300 gsm"
    textureRef: string;
    inspirationRef: string;
    voteCount: number;
}

// ==================== CHALLENGE OPTIONS ====================

export interface ChallengeOption {
    id: string;
    name: string;
    description: string;
    voteCount: number;
}

export interface TrapOption {
    id: string;
    name: string;
    description: string;
    trap: string; // The "gotcha" for this option
    isNightmare: boolean; // If true, only veterans (3+ votes) can select
    voteCount: number;
}

export interface RidiculousOption {
    id: string;
    text: string; // Max 120 chars
    submittedByUserId: ObjectId;
    submittedByDisplayName: string;
    voteCount: number;
}

// ==================== EPISODE ====================

export interface EpisodeOptions {
    benchmarks: ChallengeOption[];
    traps: TrapOption[];
    ridiculous: RidiculousOption[];
}

export interface EpisodeResults {
    winningBenchmarkId: string | null;
    winningTrapId: string | null;
    winningRidiculousId: string | null;
}

export interface Episode {
    _id: ObjectId;
    episodeNumber: number;
    operationTitle: string;
    slug: string;
    pollUrl: string | null;
    hook: string;
    status: EpisodeStatus;

    // Paper Vote Phase
    papers: PaperOption[];
    winningPaperId: string | null;

    // Challenges Phase (set after paper vote closes)
    paperName: string | null;
    identity: string | null; // Paper description
    nightmare: string | null; // Paper difficulty notes
    handicap: string | null; // Optional handicap

    // Challenge options
    options: EpisodeOptions;

    // Winners
    results: EpisodeResults;

    // Ridiculous phase control
    ridiculousEnabled: boolean;
    ridiculousSubmissionsLocked: boolean;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
}

// ==================== BALLOT ====================

export interface BallotSelections {
    paperId?: string;
    benchmarkId?: string;
    trapId?: string;
    ridiculousId?: string;
}

export type BallotPhase = 'paper' | 'challenges';

export interface Ballot {
    _id: ObjectId;
    episodeId: ObjectId;
    phase: BallotPhase;
    userId: ObjectId;
    selections: BallotSelections;
    createdAt: Date;
}

// ==================== USER ROS STATS ====================

export interface UserRosStats {
    ballotsCast: number;
    lastBallotAt: Date | null;
}

// ==================== API RESPONSE TYPES ====================

export interface ActiveEpisodeResponse {
    episode: Episode;
    userPaperVote: Ballot | null;
    userChallengesVote: Ballot | null;
    canVoteNightmare: boolean; // true if user has 3+ ballots cast
}

// ==================== CREATE/UPDATE TYPES ====================

export interface CreateEpisodeInput {
    episodeNumber: number;
    operationTitle: string;
    slug: string;
    pollUrl?: string | null;
    hook: string;
    papers: Omit<PaperOption, 'voteCount'>[];
}

export interface UpdateEpisodeInput {
    operationTitle?: string;
    slug?: string;
    pollUrl?: string | null;
    hook?: string;
    paperName?: string | null;
    identity?: string | null;
    nightmare?: string | null;
    handicap?: string | null;
    ridiculousEnabled?: boolean;
}

export interface AddChallengeOptionInput {
    name: string;
    description: string;
}

export interface AddTrapOptionInput {
    name: string;
    description: string;
    trap: string;
    isNightmare?: boolean;
}

export interface SubmitRidiculousInput {
    text: string; // Max 120 chars
}

export interface SubmitPaperVoteInput {
    paperId: string;
}

export interface SubmitChallengesVoteInput {
    benchmarkId: string;
    trapId: string;
    ridiculousId?: string;
}
