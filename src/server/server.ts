import express from 'express';
import { handleUncaughtErrors } from '../utils/errorHandling.js';
import { CONFIG } from '../config/index.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { activeRequests } from '../middleware/requestQueue.js';
import { setupSecurity } from '../middleware/security.js';
import routes from '../routes/index.js';
import { connectDB, disconnectDB } from '../db/mongo.js';

// Initialize Express app
export const app = express();

// Setup security middleware
setupSecurity(app);

// Parse JSON bodies
app.use(express.json());

// Add rate limiting
app.use(rateLimiter);

// Add routes
app.use(routes);

// Server state
let serverInstance: ReturnType<typeof app.listen> | null = null;

export interface ServerStatus {
    running: boolean;
    port: number;
    url: string;
    activeRequests: number;
    uptime: number;
}

export function getServerStatus(): ServerStatus {
    return {
        running: serverInstance !== null,
        port: CONFIG.server.port,
        url: CONFIG.server.url,
        activeRequests: activeRequests.size,
        uptime: process.uptime()
    };
}

export async function startServer(): Promise<void> {
    if (serverInstance) {
        console.log('Server is already running');
        return;
    }

    try {
        await connectDB();

        serverInstance = app.listen(CONFIG.server.port, () => {
            console.log(`Server running on ${CONFIG.server.url}`);
        });

        handleUncaughtErrors(serverInstance);
    } catch (error) {
        console.error('Failed to start server:', error);
        throw error;
    }
}

export async function stopServer(): Promise<void> {
    if (!serverInstance) {
        return;
    }

    return new Promise((resolve, reject) => {
        serverInstance?.close(async (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            try {
                await disconnectDB();
                serverInstance = null;
                activeRequests.clear();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}
