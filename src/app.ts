import express from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();



const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});


app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: 'Welcome to Multi-Tenant Organization API',
        version: '1.0.0'
    });
});



export default app;
