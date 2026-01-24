import express from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './route.js';

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Multi-Tenant Organization API',
        version: '1.0.0'
    });
});


export default app;
