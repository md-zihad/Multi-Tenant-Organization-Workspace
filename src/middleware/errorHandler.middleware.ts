import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error('Error:', {
    status,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    status,
    message:
      isProd && status === 500
        ? 'Internal server error'
        : err.message ?? 'An error occurred',
    ...(isProd ? {} : { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
