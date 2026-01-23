import 'reflect-metadata'; // Required for TypeORM decorators
import app from './app.js';
import { initializeDatabase, closeDatabase } from './config/db.js';
import { getServerConfig } from './config/env.js';

// Initialize database and start server
async function startServer() {
    try {
        const serverConfig = getServerConfig();
        await initializeDatabase();

        const server = app.listen(serverConfig.port, serverConfig.host, () => {
            console.log(`Server is running on http://${serverConfig.host}:${serverConfig.port}`);
            console.log(`Environment: ${serverConfig.nodeEnv}`);
        });


        const shutdown = async (signal: string) => {
            console.log(`${signal} received: closing HTTP server`);
            
            const shutdownTimeout = setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);

            server.close(async () => {
                try {
                    await closeDatabase();
                    clearTimeout(shutdownTimeout);
                    process.exit(0);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    console.error('Error during shutdown:', errorMessage);
                    clearTimeout(shutdownTimeout);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Failed to start server:', errorMessage);
        if (errorStack) {
            console.error('Stack trace:', errorStack);
        }
        process.exit(1);
    }
}

startServer();
