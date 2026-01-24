import type { Request, Response, NextFunction } from 'express';
import * as projectService from './project.service.js';
import type { CreateProjectDto } from './project.dto.js';

export async function createProject(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ status: 401, message: 'Authentication required' });
            return;
        }
        const data: CreateProjectDto = req.body;
        const result = await projectService.createProject(data, req.user as object);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
}


export async function getProjectsForMyOrganization(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await projectService.getProjectsForMyOrganization(req.user as object);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
}


// export async function updateProject(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> {
//     try {
//         if (!req.user) {
//             res.status(401).json({ status: 401, message: 'Authentication required' });
//             return;
//         }
//         const { id } = req.params;
//         if (typeof id !== 'string') {
//             res.status(400).json({ status: 400, message: 'Missing or invalid id parameter' });
//             return;
//         }
//         const data: UpdateProjectDto = req.body;
//         const result = await projectService.updateProject(id, data, req.user);
//         res.status(result.status).json(result);
//     } catch (error) {
//         next(error);
//     }
// }
