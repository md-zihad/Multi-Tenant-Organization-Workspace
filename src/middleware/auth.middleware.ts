import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';


export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        status: 401,
        message: 'Authorization header is missing',
      });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 401,
        message: 'Authorization header must start with "Bearer "',
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Token is missing',
      });
      return;
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';

    res.status(401).json({
      status: 401,
      message: errorMessage,
    });
  }
}


export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 401,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 403,
        message: 'Insufficient permissions. Required role: ' + allowedRoles.join(' or '),
      });
      return;
    }

    next();
  };
}
