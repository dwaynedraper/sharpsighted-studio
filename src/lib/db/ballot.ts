import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';
import type { Ballot, BallotPhase, BallotSelections } from '@/types/voting';

const COLLECTION = 'ballots';

// ==================== CREATE BALLOT ====================

export async function createBallot(
    episodeId: string,
    userId: string,
    phase: BallotPhase,
    selections: BallotSelections
): Promise<Ballot> {
    const db = await getDb();

    const ballot: Omit<Ballot, '_id'> = {
        episodeId: new ObjectId(episodeId),
        userId: new ObjectId(userId),
        phase,
        selections,
        createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(ballot);
    return { ...ballot, _id: result.insertedId } as Ballot;
}

// ==================== CHECK EXISTING VOTE ====================

export async function hasUserVoted(
    episodeId: string,
    userId: string,
    phase: BallotPhase
): Promise<boolean> {
    const db = await getDb();
    const ballot = await db.collection(COLLECTION).findOne({
        episodeId: new ObjectId(episodeId),
        userId: new ObjectId(userId),
        phase,
    });
    return !!ballot;
}

export async function getUserBallot(
    episodeId: string,
    userId: string,
    phase: BallotPhase
): Promise<Ballot | null> {
    const db = await getDb();
    return db.collection<Ballot>(COLLECTION).findOne({
        episodeId: new ObjectId(episodeId),
        userId: new ObjectId(userId),
        phase,
    });
}

export async function getUserBallots(
    episodeId: string,
    userId: string
): Promise<{ paper: Ballot | null; challenges: Ballot | null }> {
    const db = await getDb();
    const ballots = await db.collection<Ballot>(COLLECTION)
        .find({
            episodeId: new ObjectId(episodeId),
            userId: new ObjectId(userId),
        })
        .toArray();

    return {
        paper: ballots.find((b) => b.phase === 'paper') || null,
        challenges: ballots.find((b) => b.phase === 'challenges') || null,
    };
}

// ==================== COUNTS ====================

export async function countBallots(
    episodeId: string,
    phase: BallotPhase
): Promise<number> {
    const db = await getDb();
    return db.collection(COLLECTION).countDocuments({
        episodeId: new ObjectId(episodeId),
        phase,
    });
}

// ==================== USER STATS ====================

export async function getUserTotalBallotsCast(userId: string): Promise<number> {
    const db = await getDb();
    return db.collection(COLLECTION).countDocuments({
        userId: new ObjectId(userId),
    });
}
