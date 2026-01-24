import { Router } from 'express';
import * as userController from './user.controller.js';

const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/:id', userController.getUserById);
// userRouter.put('/:id', userController.updateUser);
// userRouter.get('/organization/:organizationId', userController.getUsersByOrganization);

export default userRouter;
