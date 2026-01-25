import { Router } from 'express';
import * as userController from './user.controller.js';
import {authenticate, requireRole} from '../../middleware/auth.middleware.js';


const userRouter = Router();

userRouter.post('/', authenticate, requireRole('PLATFORM_ADMIN', 'ORG_ADMIN'), userController.createUser);


export default userRouter;
