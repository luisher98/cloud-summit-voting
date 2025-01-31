import mongoose from 'mongoose';
import { CONFIG } from '../config/index.js';

const MONGODB_OPTIONS = {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    minPoolSize: 5,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority'
} as const;

export async function connectDB(): Promise<void> {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB is already connected');
            return;
        }

        const conn = await mongoose.connect(CONFIG.db.mongoUri, MONGODB_OPTIONS);
        
        if (!conn.connection.db) {
            throw new Error('Failed to get database instance');
        }

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await disconnectDB();
            process.exit(0);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export async function disconnectDB(): Promise<void> {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        }
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}

export async function clearDB(): Promise<void> {
    try {
        const db = mongoose.connection.db;
        if (mongoose.connection.readyState !== 0 && db) {
            const collections = await db.collections();
            await Promise.all(
                collections.map(collection => collection.deleteMany({}))
            );
            console.log('Database cleared successfully');
        }
    } catch (error) {
        console.error('Error clearing database:', error);
        throw error;
    }
}

export async function checkDBConnection(): Promise<boolean> {
    try {
        const db = mongoose.connection.db;
        if (mongoose.connection.readyState === 1 && db) {
            await db.admin().ping();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
} 