import helmet from 'helmet';
import cors from 'cors';
import { CONFIG } from '../config/index.js';
import { Express } from 'express';

export function setupSecurity(app: Express): void {
    // Trust proxy for correct IP detection behind load balancers
    app.set('trust proxy', true);

    // Basic security headers
    app.use(helmet());

    // CORS configuration
    const corsOptions = {
        origin: CONFIG.security.corsOrigins,
        methods: ['GET', 'POST'],
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
} 