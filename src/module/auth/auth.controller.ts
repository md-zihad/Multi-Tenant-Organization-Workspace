import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import type { LoginDto } from './auth.dto.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: LoginDto = req.body;
    const result = await authService.login(data);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}
