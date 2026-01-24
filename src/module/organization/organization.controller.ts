import type { Request, Response, NextFunction } from 'express';
import * as organizationService from './organization.service.js';
import type { CreateOrganizationDto } from './organization.dto.js';


export async function createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: CreateOrganizationDto = req.body;
    const result = await organizationService.createOrganization(data);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getAllOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await organizationService.getAllOrganizations();
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

