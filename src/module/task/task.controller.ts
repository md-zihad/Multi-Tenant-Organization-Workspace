import type { Request, Response, NextFunction } from 'express';
import * as taskService from './task.service.js';
import type { CreateTaskDto, AssignTaskDto } from './task.dto.js';

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 401, message: 'Authentication required' });
      return;
    }
    const data: CreateTaskDto = req.body;
    const result = await taskService.createTask(data, req.user);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMyTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 401, message: 'Authentication required' });
      return;
    }
    const result = await taskService.getMyTasks(req.user);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}

export async function assignTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 401, message: 'Authentication required' });
      return;
    }
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ status: 400, message: 'Missing or invalid id parameter' });
      return;
    }
    const data: AssignTaskDto = req.body;
    if (data.assignedTo === undefined) {
      res.status(400).json({
        status: 400,
        message: 'assignedTo is required (use null to unassign)',
      });
      return;
    }
    const result = await taskService.assignTask(id, data.assignedTo, req.user);
    res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
}
