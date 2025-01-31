import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/index.js';

export const rateLimiter = rateLimit({
    windowMs: CONFIG.rateLimit.windowMs,
    max: CONFIG.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => CONFIG.server.environment === 'test',
    handler: (_req, res) => {
        res.status(429).json({
            error: 'Too many requests, please try again later.',
            retryAfter: Math.ceil(CONFIG.rateLimit.windowMs / 1000)
        });
    }
}); 