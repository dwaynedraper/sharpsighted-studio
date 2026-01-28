import { getDb } from './mongodb';

/**
 * Create required MongoDB indexes for the application
 */
export async function createIndexes() {
    const db = await getDb();

    console.log('Creating MongoDB indexes...');

    try {
        // Users collection indexes
        const usersCollection = db.collection('users');

        // Unique index on email
        await usersCollection.createIndex(
            { email: 1 },
            { unique: true, name: 'email_unique' }
        );
        console.log('✓ Created unique index on users.email');

        // Unique sparse index on displayNameLower
        await usersCollection.createIndex(
            { displayNameLower: 1 },
            {
                unique: true,
                sparse: true, // Only index documents where displayNameLower exists
                name: 'displayNameLower_unique_sparse'
            }
        );
        console.log('✓ Created unique sparse index on users.displayNameLower');

        // Index for role-based queries
        await usersCollection.createIndex(
            { role: 1, 'status.isActive': 1 },
            { name: 'role_status_active' }
        );
        console.log('✓ Created compound index on users.role and status.isActive');

        // Index for suspended users
        await usersCollection.createIndex(
            { 'status.suspendedUntil': 1 },
            { name: 'status_suspendedUntil' }
        );
        console.log('✓ Created index on users.status.suspendedUntil');

        console.log('✅ All indexes created successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        throw error;
    }
}

/**
 * Script to run index creation
 */
if (require.main === module) {
    createIndexes()
        .then(() => {
            console.log('Index creation complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Index creation failed:', error);
            process.exit(1);
        });
}
