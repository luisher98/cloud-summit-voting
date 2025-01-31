import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../config/index.js';

export const activeRequests = new Set<string>();

export function requestQueueMiddleware(req: Request, res: Response, next: NextFunction): void {
    const requestId = `${req.ip}-${Date.now()}`;

    if (activeRequests.size >= CONFIG.queue.maxConcurrentRequests) {
        res.status(503).json({
            error: 'Server is busy. Please try again later.'
        });
        return;
    }

    activeRequests.add(requestId);

    const timeout = setTimeout(() => {
        activeRequests.delete(requestId);
        res.status(408).json({
            error: 'Request timeout'
        });
    }, CONFIG.queue.requestTimeoutMs);

    res.on('finish', () => {
        clearTimeout(timeout);
        activeRequests.delete(requestId);
    });

    next();
} 