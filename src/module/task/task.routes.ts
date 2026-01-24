import { Router } from 'express';
import * as taskController from './task.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const taskRouter = Router();

taskRouter.post(
  '/',
  authenticate,
  requireRole('ORG_ADMIN'),
  taskController.createTask
);

taskRouter.get(
  '/my-tasks',
  authenticate,
  requireRole('MEMBER'),
  taskController.getMyTasks
);

taskRouter.patch(
  '/:id/assign',
  authenticate,
  requireRole('ORG_ADMIN'),
  taskController.assignTask
);

export default taskRouter;
