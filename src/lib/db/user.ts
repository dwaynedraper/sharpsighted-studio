import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';
import { createAuditLog } from './audit';

export interface User {
    _id: ObjectId;
    email: string;
    emailVerifiedAt: Date | null;
    firstName: string | null;
    displayName: string | null;
    displayNameLower: string | null;
    displayNameChangedAt: Date | null;
    image: string | null;
    role: 'user' | 'admin' | 'superAdmin';
    status: {
        isActive: boolean;
        deactivatedAt: Date | null;
        suspendedUntil: Date | null;
    };
    onboarding: {
        isComplete: boolean;
        completedAt: Date | null;
    };
    preferences: {
        theme: 'light' | 'dark' | 'system';
        accent: string;
    };
    rosStats?: {
        ballotsCast: number;
        lastBallotAt: Date | null;
    };
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({
        email: email.toLowerCase()
    });
    return user;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string | ObjectId): Promise<User | null> {
    const db = await getDb();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const user = await db.collection<User>('users').findOne({ _id: objectId });
    return user;
}

/**
 * Check if a display name is available (case-insensitive)
 */
export async function checkDisplayNameAvailable(displayName: string, excludeUserId?: string): Promise<boolean> {
    const db = await getDb();
    const displayNameLower = displayName.toLowerCase().trim();

    const query: any = { displayNameLower };

    // Exclude current user if provided (for display name changes)
    if (excludeUserId) {
        query._id = { $ne: new ObjectId(excludeUserId) };
    }

    const existing = await db.collection('users').findOne(query);
    return existing === null;
}

/**
 * Update user onboarding completion
 */
export async function updateOnboardingComplete(
    userId: string,
    firstName: string,
    displayName: string
): Promise<void> {
    const db = await getDb();
    const displayNameLower = displayName.toLowerCase().trim();

    // Check if display name is available
    const isAvailable = await checkDisplayNameAvailable(displayName, userId);
    if (!isAvailable) {
        throw new Error('Display name is already taken');
    }

    const now = new Date();

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
            $set: {
                firstName,
                displayName,
                displayNameLower,
                displayNameChangedAt: now,
                'onboarding.isComplete': true,
                'onboarding.completedAt': now,
                updatedAt: now,
            },
        }
    );

    // Log audit event
    await createAuditLog({
        actorUserId: userId,
        actorRole: 'user',
        action: 'ONBOARDING_COMPLETED',
        entityType: 'user',
        entityId: userId,
        metadata: { displayName },
    });
}

/**
 * Create a new user with defaults
 */
export async function createUser(email: string, emailVerified: boolean = false): Promise<User> {
    const db = await getDb();
    const now = new Date();

    const newUser: Omit<User, '_id'> = {
        email: email.toLowerCase(),
        emailVerifiedAt: emailVerified ? now : null,
        firstName: null,
        displayName: null,
        displayNameLower: null,
        displayNameChangedAt: null,
        image: null,
        role: 'user',
        status: {
            isActive: true,
            deactivatedAt: null,
            suspendedUntil: null,
        },
        onboarding: {
            isComplete: false,
            completedAt: null,
        },
        preferences: {
            theme: 'system',
            accent: '#38bdf8', // Brand blue default
        },
        createdAt: now,
        updatedAt: now,
    };

    const result = await db.collection<User>('users').insertOne(newUser as any);

    return {
        ...newUser,
        _id: result.insertedId,
    };
}

/**
 * Update user's avatar image URL
 */
export async function updateUserImage(userId: string, imageUrl: string): Promise<void> {
    const db = await getDb();
    const now = new Date();

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
            $set: {
                image: imageUrl,
                updatedAt: now,
            },
        }
    );
}

/**
 * Update user role (superAdmin only)
 */
export async function updateUserRole(
    userId: string,
    newRole: 'user' | 'admin' | 'superAdmin',
    actorUserId: string,
    actorRole: 'user' | 'admin' | 'superAdmin'
): Promise<void> {
    const db = await getDb();

    // Get the user to check current role
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const oldRole = user.role;
    if (oldRole === newRole) {
        throw new Error('User already has this role');
    }

    const now = new Date();

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
            $set: {
                role: newRole,
                updatedAt: now,
            },
        }
    );

    // Log ADMIN_CREATED if promoting to admin/superAdmin from user
    if (oldRole === 'user' && (newRole === 'admin' || newRole === 'superAdmin')) {
        await createAuditLog({
            actorUserId,
            actorRole,
            action: 'ADMIN_CREATED',
            entityType: 'user',
            entityId: userId,
            metadata: { oldRole, newRole, targetEmail: user.email },
        });
    }

    // Always log ROLE_CHANGED
    await createAuditLog({
        actorUserId,
        actorRole,
        action: 'ROLE_CHANGED',
        entityType: 'user',
        entityId: userId,
        metadata: { oldRole, newRole, targetEmail: user.email },
    });
}

/**
 * Get user's RoS stats (for eligibility checks)
 */
export async function getRosStats(userId: string): Promise<{ ballotsCast: number; lastBallotAt: Date | null }> {
    const user = await getUserById(userId);
    return user?.rosStats ?? { ballotsCast: 0, lastBallotAt: null };
}

/**
 * Increment user's RoS ballots cast after voting
 */
export async function incrementRosBallotsCast(userId: string): Promise<void> {
    const db = await getDb();
    const now = new Date();

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
            $inc: { 'rosStats.ballotsCast': 1 },
            $set: {
                'rosStats.lastBallotAt': now,
                updatedAt: now,
            },
        }
    );
}
