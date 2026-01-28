#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require("mongodb");

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI is not set");
        process.exit(1);
    }

    console.log("🚀 Starting database setup...\n");

    const client = new MongoClient(uri);
    try {
        await client.connect();

        // Use the database specified in the URI
        const dbName = new URL(uri).pathname.replace("/", "") || "sharpsighted_studio";
        const db = client.db(dbName);

        const users = db.collection("users");

        // Email unique
        await users.createIndex(
            { email: 1 },
            { unique: true, name: "email_unique" }
        );
        console.log("✓ Created unique index on users.email");

        // displayNameLower unique, only when present and valid
        await users.createIndex(
            { displayNameLower: 1 },
            {
                unique: true,
                name: "displayNameLower_unique_partial",
                partialFilterExpression: {
                    displayNameLower: { $exists: true, $type: "string" }
                }
            }
        );
        console.log("✓ Created unique partial index on users.displayNameLower");

        // role + active
        await users.createIndex(
            { role: 1, "status.isActive": 1 },
            { name: "role_status_active" }
        );
        console.log("✓ Created compound index on users.role and status.isActive");

        // suspendedUntil
        await users.createIndex(
            { "status.suspendedUntil": 1 },
            { name: "status_suspendedUntil" }
        );
        console.log("✓ Created index on users.status.suspendedUntil");

        console.log("\n✅ Database setup complete!");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Database setup failed:", err);
        process.exit(1);
    } finally {
        await client.close().catch(() => { });
    }
}

run();