import { Router } from 'express';
import * as projectController from './project.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const projectRouter = Router();

projectRouter.post(
  '/',
  authenticate,
  requireRole('ORG_ADMIN'),
  projectController.createProject
);

projectRouter.get(
  '/',
  authenticate,
  requireRole('ORG_ADMIN'),
  projectController.getProjectsForMyOrganization
);

// projectRouter.get(
//   '/organization/:organizationId',
//   authenticate,
//   requireRole('ORG_ADMIN'),
//   projectController.getProjectsByOrganization
// );

// projectRouter.get(
//   '/:id',
//   authenticate,
//   requireRole('ORG_ADMIN'),
//   projectController.getProjectById
// );

// projectRouter.put(
//   '/:id',
//   authenticate,
//   requireRole('ORG_ADMIN'),
//   projectController.updateProject
// );

export default projectRouter;
