#!/usr/bin/env node
const { MongoClient } = require("mongodb");

async function setup() {
    console.log("🚀 Starting database setup...\n");

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI in environment");

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db();
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    await users.createIndex(
        { displayNameLower: 1 },
        {
            unique: true,
            partialFilterExpression: {
                displayNameLower: { $exists: true, $type: "string" }
            }
        }
    );

    console.log("✅ Indexes ensured:");
    console.log("- users.email unique");
    console.log("- users.displayNameLower unique (partial)");

    await client.close();
    console.log("\n✅ Database setup complete!");
}

setup().catch((error) => {
    console.error("\n❌ Database setup failed:", error);
    process.exit(1);
});