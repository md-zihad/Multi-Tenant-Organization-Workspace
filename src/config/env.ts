/**
 * Environment Variable Validation and Configuration
 * 
 * Validates required environment variables and provides type-safe access
 */

interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    sslRejectUnauthorized: boolean;
    maxConnections: number;
    synchronize: boolean;
}

interface ServerConfig {
    port: number;
    host: string;
    nodeEnv: string;
}

interface JWTConfig {
    secret: string;
    expiresIn: string;
}

/**
 * Validates and returns database configuration
 */
export function getDatabaseConfig(): DatabaseConfig {
    const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'] as const;
    const missing: string[] = [];

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all database variables are set.'
        );
    }

    const port = Number(process.env.DB_PORT);
    if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid DB_PORT: ${process.env.DB_PORT}. Must be a number between 1 and 65535.`);
    }

    return {
        host: process.env.DB_HOST!,
        port,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        ssl: process.env.DB_SSL === 'true',
        sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 10,
        synchronize: process.env.NODE_ENV === 'development' && process.env.DB_SYNCHRONIZE === 'true',
    };
}

/**
 * Validates and returns server configuration
 */
export function getServerConfig(): ServerConfig {
    const port = Number(process.env.PORT) || 4000;
    if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535.`);
    }

    return {
        port,
        host: process.env.HOST || '0.0.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
    };
}

/**
 * Validates and returns JWT configuration
 */
export function getJWTConfig(): JWTConfig {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error(
            'Missing required environment variable: JWT_SECRET\n' +
            'Please check your .env file and ensure JWT_SECRET is set.'
        );
    }

    if (secret.length < 15) {
        throw new Error(
            'JWT_SECRET must be at least 15 characters long for security purposes.'
        );
    }

    return {
        secret,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };
}
