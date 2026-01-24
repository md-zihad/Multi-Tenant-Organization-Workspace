import { DataSource, type DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { getDatabaseConfig } from './env.js';
import { User } from '../module/user/User.entity.js';
import { Organization } from '../module/organization/Organization.entity.js';
import { Project } from '../module/project/Project.entity.js';
import { Task } from '../module/task/Task.entity.js';

dotenv.config();

/**
 * TypeORM DataSource Configuration
 * 
 * This configuration supports ES modules and TypeScript.
 * For multi-tenant architecture, you may want to use:
 * - Multiple data sources (one per tenant)
 * - Row-level security (RLS) with a tenant_id column
 * - Schema-based multi-tenancy
 */
const dbConfig = getDatabaseConfig();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    
    // Entity and migration paths
    // Using .js extension for compiled output (ES modules requirement)
    entities: [User, Organization, Project, Task],
    migrations: ['dist/migrations/*.js'],
    
    // Development settings
    synchronize: dbConfig.synchronize, // NEVER use in production!
    logging: process.env.NODE_ENV === 'development',
    
    // Connection pool settings
    extra: {
        max: dbConfig.maxConnections,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
    
    // SSL configuration (for production)
    ssl: dbConfig.ssl ? {
        rejectUnauthorized: dbConfig.sslRejectUnauthorized
    } : false,
};

// Create and export the DataSource instance
export const AppDataSource = new DataSource(dataSourceOptions);

/**
 * Initialize the database connection
 * Call this in your server startup
 */
export async function initializeDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established successfully');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('❌ Error during database initialization:', errorMessage);
        if (errorStack) {
            console.error('Stack trace:', errorStack);
        }
        throw error;
    }
}

/**
 * Close the database connection
 * Call this during graceful shutdown
 */
export async function closeDatabase(): Promise<void> {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('✅ Database connection closed');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error closing database connection:', errorMessage);
        // Don't throw during shutdown - log and continue
    }
}
