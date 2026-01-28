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
