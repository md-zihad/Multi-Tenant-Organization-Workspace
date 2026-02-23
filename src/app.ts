import express from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './route.js';
import { generalLimiter } from './middleware/ratelimit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';
import { register } from './utils/metrics.js';
import logger, { requestLogger } from './utils/logger.js';
import { performHealthCheck, readinessCheck, livenessCheck } from './utils/health.js';

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Metrics middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    logger.info(`${req.method} ${route} ${res.statusCode}`);
  });
  next();
});

app.use('/api/v1', generalLimiter, routes);

app.get('/health', async (_req: Request, res: Response) => {
    try {
        const health = await performHealthCheck();
        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        logger.error('Health check failed', { error });
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});

app.get('/ready', async (_req: Request, res: Response) => {
    try {
        const readiness = await readinessCheck();
        const statusCode = readiness.ready ? 200 : 503;
        res.status(statusCode).json(readiness);
    } catch (error) {
        logger.error('Readiness check failed', { error });
        res.status(503).json({
            ready: false,
            error: 'Readiness check failed'
        });
    }
});

app.get('/live', async (_req: Request, res: Response) => {
    try {
        const liveness = await livenessCheck();
        res.status(200).json(liveness);
    } catch (error) {
        logger.error('Liveness check failed', { error });
        res.status(503).json({
            alive: false,
            error: 'Liveness check failed'
        });
    }
});

app.get('/metrics', async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Metrics endpoint error', { error });
    res.status(500).end(error);
  }
});

app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Multi-Tenant Organization API',
        version: '1.0.0'
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
