import { connectDB, disconnectDB } from '../db/mongo.js';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        await connectDB();
        console.log('Successfully connected to MongoDB Atlas!');
        
        await disconnectDB();
        console.log('Successfully disconnected from MongoDB Atlas');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testConnection(); 