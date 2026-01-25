import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';


function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  return token || null;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({
      status: 401,
      message: 'Authorization header is missing or invalid. Use: Bearer <token>',
    });
    return;
  }

  try {
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
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Authorization header is missing or invalid. Use: Bearer <token>',
      });
      return;
    }

    try {
      const decoded = verifyAccessToken(token);
      const roleFromToken = decoded.role;
    


      if (!allowedRoles.includes(roleFromToken)) {
        res.status(403).json({
          status: 403,
          message: 'Insufficient permissions. Required role: ' + allowedRoles.join(' or '),
        });
        return;
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        organizationId: decoded.organizationId,
      };

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid or expired token';
      res.status(401).json({ status: 401, message });
    }
  };
}
