import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';
import { createAuditLog } from './audit';
import type {
    Episode,
    EpisodeStatus,
    PaperOption,
    ChallengeOption,
    TrapOption,
    RidiculousOption,
    CreateEpisodeInput,
    UpdateEpisodeInput,
    AddChallengeOptionInput,
    AddTrapOptionInput,
} from '@/types/voting';
import { nanoid } from 'nanoid';

const COLLECTION = 'episodes';

// ==================== HELPERS ====================

function generateId(): string {
    return nanoid(10);
}

function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Remove non-alphanumeric except spaces and dashes
        .replace(/\s+/g, '-')           // Replace spaces with dashes
        .replace(/-+/g, '-')            // Collapse multiple dashes
        .replace(/^-|-$/g, '');         // Trim leading/trailing dashes
}

// ==================== CRUD ====================

export async function createEpisode(
    input: CreateEpisodeInput,
    userId: string,
    userRole: string
): Promise<Episode> {
    const db = await getDb();

    const episode: Omit<Episode, '_id'> = {
        episodeNumber: input.episodeNumber,
        operationTitle: input.operationTitle,
        slug: sanitizeSlug(input.slug),
        pollUrl: input.pollUrl || null,
        hook: input.hook,
        status: 'paper_voting',
        papers: input.papers.map((p) => ({
            ...p,
            id: generateId(),
            voteCount: 0,
        })),
        winningPaperId: null,
        paperName: null,
        identity: null,
        nightmare: null,
        handicap: null,
        options: {
            benchmarks: [],
            traps: [],
            ridiculous: [],
        },
        results: {
            winningBenchmarkId: null,
            winningTrapId: null,
            winningRidiculousId: null,
        },
        ridiculousEnabled: false,
        ridiculousSubmissionsLocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
    };

    const result = await db.collection(COLLECTION).insertOne(episode);

    await createAuditLog({
        action: 'episode.create',
        actorUserId: new ObjectId(userId),
        actorRole: userRole,
        entityId: result.insertedId,
        entityType: 'episode',
        metadata: { episodeNumber: input.episodeNumber, operationTitle: input.operationTitle },
    });

    return { ...episode, _id: result.insertedId } as Episode;
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
    const db = await getDb();
    return db.collection<Episode>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
    const db = await getDb();
    return db.collection<Episode>(COLLECTION).findOne({ slug: slug.toLowerCase() });
}

export async function getCurrentEpisode(): Promise<Episode | null> {
    const db = await getDb();
    return db.collection<Episode>(COLLECTION).findOne(
        { status: { $in: ['paper_voting', 'challenges_voting'] } },
        { sort: { episodeNumber: -1 } }
    );
}

export async function listEpisodes(status?: EpisodeStatus): Promise<Episode[]> {
    const db = await getDb();
    const query = status ? { status } : {};
    return db.collection<Episode>(COLLECTION).find(query).sort({ episodeNumber: -1 }).toArray();
}

export async function updateEpisode(
    id: string,
    updates: UpdateEpisodeInput,
    userId: string,
    userRole: string
): Promise<Episode | null> {
    const db = await getDb();

    const result = await db.collection<Episode>(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
    );

    if (result) {
        await createAuditLog({
            action: 'episode.update',
            actorUserId: new ObjectId(userId),
            actorRole: userRole,
            entityId: new ObjectId(id),
            entityType: 'episode',
            metadata: { updates: Object.keys(updates) },
        });
    }

    return result;
}

export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const db = await getDb();
    const query: any = { slug: sanitizeSlug(slug) };
    if (excludeId) {
        query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await db.collection(COLLECTION).findOne(query);
    return !existing;
}

// ==================== PAPER VOTE PHASE ====================

export async function incrementPaperVote(
    episodeId: string,
    paperId: string
): Promise<void> {
    const db = await getDb();
    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId), 'papers.id': paperId },
        { $inc: { 'papers.$.voteCount': 1 }, $set: { updatedAt: new Date() } }
    );
}

export async function closePaperVote(
    id: string,
    userId: string,
    userRole: string
): Promise<Episode | null> {
    const db = await getDb();

    // Get episode to determine winner
    const episode = await getEpisodeById(id);
    if (!episode || episode.status !== 'paper_voting') return null;

    // Find winning paper (highest vote count)
    const winner = episode.papers.reduce((a, b) => (a.voteCount > b.voteCount ? a : b));

    const result = await db.collection<Episode>(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                status: 'challenges_voting',
                winningPaperId: winner.id,
                paperName: winner.name,
                updatedAt: new Date(),
            },
        },
        { returnDocument: 'after' }
    );

    if (result) {
        await createAuditLog({
            action: 'episode.close_paper_vote',
            actorUserId: new ObjectId(userId),
            actorRole: userRole,
            entityId: new ObjectId(id),
            entityType: 'episode',
            metadata: { winningPaperId: winner.id, paperName: winner.name },
        });
    }

    return result;
}

// ==================== CHALLENGES MANAGEMENT ====================

export async function addBenchmarkOption(
    episodeId: string,
    input: AddChallengeOptionInput,
    userId: string,
    userRole: string
): Promise<ChallengeOption> {
    const db = await getDb();

    const option: ChallengeOption = {
        id: generateId(),
        name: input.name,
        description: input.description,
        voteCount: 0,
    };

    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId) },
        {
            $push: { 'options.benchmarks': option } as any,
            $set: { updatedAt: new Date() },
        }
    );

    await createAuditLog({
        action: 'episode.add_benchmark',
        actorUserId: new ObjectId(userId),
        actorRole: userRole,
        entityId: new ObjectId(episodeId),
        entityType: 'episode',
        metadata: { optionId: option.id, name: option.name },
    });

    return option;
}

export async function addTrapOption(
    episodeId: string,
    input: AddTrapOptionInput,
    userId: string,
    userRole: string
): Promise<TrapOption> {
    const db = await getDb();

    const option: TrapOption = {
        id: generateId(),
        name: input.name,
        description: input.description,
        trap: input.trap,
        isNightmare: input.isNightmare || false,
        voteCount: 0,
    };

    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId) },
        {
            $push: { 'options.traps': option } as any,
            $set: { updatedAt: new Date() },
        }
    );

    await createAuditLog({
        action: 'episode.add_trap',
        actorUserId: new ObjectId(userId),
        actorRole: userRole,
        entityId: new ObjectId(episodeId),
        entityType: 'episode',
        metadata: { optionId: option.id, name: option.name, isNightmare: option.isNightmare },
    });

    return option;
}

export async function addRidiculousOption(
    episodeId: string,
    text: string,
    submittedByUserId: ObjectId,
    submittedByDisplayName: string
): Promise<RidiculousOption | null> {
    const db = await getDb();

    // Check if submissions are locked
    const episode = await getEpisodeById(episodeId);
    if (!episode || episode.ridiculousSubmissionsLocked) return null;

    // Check submission count
    if (episode.options.ridiculous.length >= 5) {
        // Lock submissions
        await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(episodeId) },
            { $set: { ridiculousSubmissionsLocked: true, updatedAt: new Date() } }
        );
        return null;
    }

    const option: RidiculousOption = {
        id: generateId(),
        text: text.slice(0, 120), // Enforce max length
        submittedByUserId,
        submittedByDisplayName,
        voteCount: 0,
    };

    const result = await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId), ridiculousSubmissionsLocked: false },
        {
            $push: { 'options.ridiculous': option } as any,
            $set: {
                ridiculousSubmissionsLocked: episode.options.ridiculous.length >= 4, // Will be 5 after this
                updatedAt: new Date(),
            },
        }
    );

    if (result.modifiedCount === 0) return null;

    return option;
}

// ==================== CHALLENGES VOTING ====================

export async function incrementChallengesVote(
    episodeId: string,
    benchmarkId: string,
    trapId: string,
    ridiculousId?: string
): Promise<void> {
    const db = await getDb();
    const episode = await db.collection(COLLECTION).findOne({ _id: new ObjectId(episodeId) });
    if (!episode) return;

    const updates: any = { updatedAt: new Date() };
    const arrayFilters: any[] = [];

    // Update benchmark
    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId), 'options.benchmarks.id': benchmarkId },
        { $inc: { 'options.benchmarks.$.voteCount': 1 } }
    );

    // Update trap
    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(episodeId), 'options.traps.id': trapId },
        { $inc: { 'options.traps.$.voteCount': 1 } }
    );

    // Update ridiculous if provided
    if (ridiculousId) {
        await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(episodeId), 'options.ridiculous.id': ridiculousId },
            { $inc: { 'options.ridiculous.$.voteCount': 1 } }
        );
    }
}

export async function closeChallengesVote(
    id: string,
    userId: string,
    userRole: string
): Promise<Episode | null> {
    const db = await getDb();

    const episode = await getEpisodeById(id);
    if (!episode || episode.status !== 'challenges_voting') return null;

    // Determine winners
    const winningBenchmark = episode.options.benchmarks.reduce((a, b) =>
        a.voteCount > b.voteCount ? a : b
    );
    const winningTrap = episode.options.traps.reduce((a, b) =>
        a.voteCount > b.voteCount ? a : b
    );
    const winningRidiculous = episode.options.ridiculous.length > 0
        ? episode.options.ridiculous.reduce((a, b) => (a.voteCount > b.voteCount ? a : b))
        : null;

    const result = await db.collection<Episode>(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                status: 'closed',
                'results.winningBenchmarkId': winningBenchmark?.id || null,
                'results.winningTrapId': winningTrap?.id || null,
                'results.winningRidiculousId': winningRidiculous?.id || null,
                closedAt: new Date(),
                updatedAt: new Date(),
            },
        },
        { returnDocument: 'after' }
    );

    if (result) {
        await createAuditLog({
            action: 'episode.close_challenges_vote',
            actorUserId: new ObjectId(userId),
            actorRole: userRole,
            entityId: new ObjectId(id),
            entityType: 'episode',
            metadata: {
                winningBenchmarkId: winningBenchmark?.id,
                winningTrapId: winningTrap?.id,
                winningRidiculousId: winningRidiculous?.id,
            },
        });
    }

    return result;
}

// ==================== ARCHIVE ====================

export async function archiveEpisode(
    id: string,
    userId: string,
    userRole: string
): Promise<Episode | null> {
    const db = await getDb();

    const result = await db.collection<Episode>(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: 'archived', updatedAt: new Date() } },
        { returnDocument: 'after' }
    );

    if (result) {
        await createAuditLog({
            action: 'episode.archive',
            actorUserId: new ObjectId(userId),
            actorRole: userRole,
            entityId: new ObjectId(id),
            entityType: 'episode',
        });
    }

    return result;
}
