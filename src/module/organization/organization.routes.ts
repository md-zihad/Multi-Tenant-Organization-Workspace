import { Router } from 'express';
import * as organizationController from './organization.controller.js';
import {authenticate, requireRole} from '../../middleware/auth.middleware.js';

const organizationRouter = Router();

organizationRouter.post('/', authenticate, requireRole('PLATFORM_ADMIN'), organizationController.createOrganization);

organizationRouter.get('/', authenticate, requireRole('PLATFORM_ADMIN'), organizationController.getAllOrganizations);


export default organizationRouter;