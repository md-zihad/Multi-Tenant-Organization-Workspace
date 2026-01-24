import { Router } from 'express';
import userRoutes from './module/user/user.routes.js';
import authRoutes from './module/auth/auth.routes.js';
import organizationRoutes from './module/organization/organization.routes.js';
import projectRoutes from './module/project/project.routes.js';
import taskRoutes from './module/task/task.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
