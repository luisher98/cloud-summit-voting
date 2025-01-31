import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    // Server
    PORT: z.string().transform(Number).default('5050'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Security
    CORS_ORIGINS: z.string().default('*'),
    API_KEY_HEADER: z.string().default('x-api-key'),
    API_KEYS: z.string().transform(keys => keys.split(',')).default(''),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.number().default(60000),
    RATE_LIMIT_MAX_REQUESTS: z.number().default(10),

    // Queue
    MAX_CONCURRENT_REQUESTS: z.number().default(2),
    REQUEST_TIMEOUT_MS: z.number().default(30000),

    // Database
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    MONGODB_USER: z.string().optional(),
    MONGODB_PASSWORD: z.string().optional(),
    MONGODB_DB_NAME: z.string().default('cloudsummit'),
    MONGODB_MIN_POOL_SIZE: z.number().default(5),
    MONGODB_MAX_POOL_SIZE: z.number().default(10),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 4));
    process.exit(1);
}

interface DbConfig {
    mongoUri: string;
}

interface Config {
    server: {
        port: number;
        url: string;
        environment: string;
    };
    security: {
        corsOrigins: string[];
        apiKeyHeader: string;
        apiKeys: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    queue: {
        maxConcurrentRequests: number;
        requestTimeoutMs: number;
    };
    db: DbConfig;
}

// Construct MongoDB URI if individual components are provided
function getMongoUri(env: z.infer<typeof envSchema>): string {
    if (env.MONGODB_URI) return env.MONGODB_URI;
    
    const credentials = env.MONGODB_USER && env.MONGODB_PASSWORD
        ? `${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@`
        : '';
    
    return `mongodb://${credentials}localhost:27017/${env.MONGODB_DB_NAME}`;
}

export let CONFIG: Config = {
    server: {
        port: env.data.PORT,
        url: `http://localhost:${env.data.PORT}`,
        environment: env.data.NODE_ENV,
    },
    security: {
        corsOrigins: env.data.CORS_ORIGINS.split(','),
        apiKeyHeader: env.data.API_KEY_HEADER,
        apiKeys: env.data.API_KEYS,
    },
    rateLimit: {
        windowMs: env.data.RATE_LIMIT_WINDOW_MS,
        maxRequests: env.data.RATE_LIMIT_MAX_REQUESTS,
    },
    queue: {
        maxConcurrentRequests: env.data.MAX_CONCURRENT_REQUESTS,
        requestTimeoutMs: env.data.REQUEST_TIMEOUT_MS
    },
    db: {
        mongoUri: getMongoUri(env.data),
    }
};

// Add function to update config (for testing)
export function updateConfig(newConfig: Partial<Config>) {
    CONFIG = { ...CONFIG, ...newConfig };
}

export const isProduction = () => CONFIG.server.environment === 'production';
export const isDevelopment = () => CONFIG.server.environment === 'development';
export const isTest = () => CONFIG.server.environment === 'test'; 