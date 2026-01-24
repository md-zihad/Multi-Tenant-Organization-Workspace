import type { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import type { CreateUserDto } from './user.dto.js';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: CreateUserDto = req.body;
    const result = await userService.createUser(req.user as object, data);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Missing or invalid id parameter' });
      return;
    }
    const result = await userService.getUserById(id);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

