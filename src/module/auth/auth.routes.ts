import { Router } from 'express';
import * as authController from './auth.controller.js';
import { loginLimiter } from '../../middleware/ratelimit.middleware.js';

const authRouter = Router();

authRouter.post('/login', loginLimiter, authController.login);

export default authRouter;
