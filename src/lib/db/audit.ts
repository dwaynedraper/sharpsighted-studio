import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

export interface AuditLogEntry {
    _id?: ObjectId;
    actorUserId: string | ObjectId;
    actorRole: string;
    action: string;
    entityType: string;
    entityId: string | ObjectId;
    metadata?: Record<string, any>;
    createdAt: Date;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: Omit<AuditLogEntry, '_id' | 'createdAt'>): Promise<void> {
    const db = await getDb();

    const logEntry: Omit<AuditLogEntry, '_id'> = {
        ...entry,
        actorUserId: typeof entry.actorUserId === 'string' ? new ObjectId(entry.actorUserId) : entry.actorUserId,
        entityId: typeof entry.entityId === 'string' ? entry.entityId : entry.entityId.toString(),
        createdAt: new Date(),
    };

    await db.collection('auditLog').insertOne(logEntry);
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogsForEntity(
    entityType: string,
    entityId: string | ObjectId,
    limit: number = 50
): Promise<AuditLogEntry[]> {
    const db = await getDb();

    const logs = await db
        .collection<AuditLogEntry>('auditLog')
        .find({
            entityType,
            entityId: typeof entityId === 'string' ? entityId : entityId.toString(),
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

    return logs;
}

/**
 * Get audit logs for a specific user (as actor)
 */
export async function getAuditLogsForActor(
    actorUserId: string | ObjectId,
    limit: number = 50
): Promise<AuditLogEntry[]> {
    const db = await getDb();

    const objectId = typeof actorUserId === 'string' ? new ObjectId(actorUserId) : actorUserId;

    const logs = await db
        .collection<AuditLogEntry>('auditLog')
        .find({ actorUserId: objectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

    return logs;
}
