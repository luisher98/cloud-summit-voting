/**
 * Main application entry point.
 * Starts either the CLI or server based on command line arguments.
 * 
 * @example
 * // Start server mode
 * npm run build
 * npm run start
 * 
 */

import { startServer } from './server/server.js';

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

async function handleShutdown(signal: string): Promise<void> {
    console.log(`\nReceived ${signal}. Cleaning up...`);
    process.exit(0);
}

// Start server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});