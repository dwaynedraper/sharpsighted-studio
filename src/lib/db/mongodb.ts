import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development, use a global variable to preserve the MongoClient across hot reloads
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, create a new MongoClient
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;

/**
 * Get the database instance
 */
export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db();
}
