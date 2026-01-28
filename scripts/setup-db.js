#!/usr/bin/env node

/**
 * MongoDB Setup Script
 * 
 * This script creates the required indexes for the Sharp Sighted Studio application.
 * Run this once after setting up your MongoDB database.
 * 
 * Usage:
 *   node scripts/setup-db.js
 *   or
 *   npm run setup-db
 */

const { createIndexes } = require('../src/lib/db/indexes');

async function setup() {
    console.log('🚀 Starting database setup...\n');

    try {
        await createIndexes();
        console.log('\n✅ Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database setup failed:', error);
        process.exit(1);
    }
}

setup();
