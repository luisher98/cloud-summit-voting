import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { updateConfig } from '../config/index.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Update config to use in-memory database
    updateConfig({
        db: { mongoUri: uri }
    });
    
    // Connect to in-memory database
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
    console.log('Cleaned up MongoDB instance');
});

afterEach(async () => {
    const db = mongoose.connection.db;
    if (mongoose.connection.readyState !== 0 && db) {
        const collections = await db.collections();
        await Promise.all(
            collections.map(collection => collection.deleteMany({}))
        );
    }
});

// Handle ESM exports
export {}; 