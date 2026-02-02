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

        // ==================== USERS ====================
        console.log("📁 Setting up users collection...");
        const users = db.collection("users");

        await users.createIndex(
            { email: 1 },
            { unique: true, name: "email_unique" }
        );
        console.log("  ✓ Created unique index on users.email");

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
        console.log("  ✓ Created unique partial index on users.displayNameLower");

        await users.createIndex(
            { role: 1, "status.isActive": 1 },
            { name: "role_status_active" }
        );
        console.log("  ✓ Created compound index on users.role and status.isActive");

        await users.createIndex(
            { "status.suspendedUntil": 1 },
            { name: "status_suspendedUntil" }
        );
        console.log("  ✓ Created index on users.status.suspendedUntil");

        // ==================== EPISODES ====================
        console.log("\n📁 Setting up episodes collection...");
        const episodes = db.collection("episodes");

        await episodes.createIndex(
            { slug: 1 },
            { unique: true, name: "slug_unique" }
        );
        console.log("  ✓ Created unique index on episodes.slug");

        await episodes.createIndex(
            { status: 1, publishedAt: -1 },
            { name: "status_publishedAt" }
        );
        console.log("  ✓ Created index on episodes.status and publishedAt");

        await episodes.createIndex(
            { isCurrent: 1 },
            { name: "isCurrent" }
        );
        console.log("  ✓ Created index on episodes.isCurrent");

        // ==================== VOTES ====================
        console.log("\n📁 Setting up votes collection...");
        const votes = db.collection("votes");

        await votes.createIndex(
            { slug: 1 },
            { unique: true, name: "slug_unique" }
        );
        console.log("  ✓ Created unique index on votes.slug");

        await votes.createIndex(
            { status: 1, phase: 1, "timing.opensAt": 1, "timing.endsAt": 1 },
            { name: "status_phase_timing" }
        );
        console.log("  ✓ Created compound index on votes status, phase, timing");

        await votes.createIndex(
            { episodeId: 1, status: 1, phase: 1 },
            { name: "episodeId_status_phase" }
        );
        console.log("  ✓ Created compound index on votes episodeId, status, phase");

        // ==================== VOTE OPTIONS ====================
        console.log("\n📁 Setting up voteOptions collection...");
        const voteOptions = db.collection("voteOptions");

        await voteOptions.createIndex(
            { voteId: 1, order: 1 },
            { name: "voteId_order" }
        );
        console.log("  ✓ Created index on voteOptions.voteId and order");

        await voteOptions.createIndex(
            { voteId: 1, isActive: 1 },
            { name: "voteId_isActive" }
        );
        console.log("  ✓ Created index on voteOptions.voteId and isActive");

        await voteOptions.createIndex(
            { voteId: 1, "flags.isUserSubmitted": 1 },
            { name: "voteId_isUserSubmitted" }
        );
        console.log("  ✓ Created index on voteOptions.voteId and flags.isUserSubmitted");

        // ==================== BALLOTS ====================
        console.log("\n📁 Setting up ballots collection...");
        const ballots = db.collection("ballots");

        await ballots.createIndex(
            { voteId: 1, userId: 1 },
            { unique: true, name: "voteId_userId_unique" }
        );
        console.log("  ✓ Created unique index on ballots.voteId + userId (one vote per user)");

        await ballots.createIndex(
            { optionId: 1 },
            { name: "optionId" }
        );
        console.log("  ✓ Created index on ballots.optionId");

        await ballots.createIndex(
            { userId: 1, createdAt: -1 },
            { name: "userId_createdAt" }
        );
        console.log("  ✓ Created index on ballots.userId and createdAt");

        // ==================== AUDIT LOG ====================
        console.log("\n📁 Setting up auditLog collection...");
        const auditLog = db.collection("auditLog");

        await auditLog.createIndex(
            { actorUserId: 1, createdAt: -1 },
            { name: "actorUserId_createdAt" }
        );
        console.log("  ✓ Created index on auditLog.actorUserId and createdAt");

        await auditLog.createIndex(
            { entityType: 1, entityId: 1, createdAt: -1 },
            { name: "entity_createdAt" }
        );
        console.log("  ✓ Created index on auditLog entity and createdAt");

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