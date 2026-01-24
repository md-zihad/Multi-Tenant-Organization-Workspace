import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  organizationId: string | null;
}


export function generateAccessToken(
  payload: TokenPayload,
  expiresIn: string | number = '24h'
): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as StringValue | number,
    issuer: 'multi-tenant-organization-workspace',
  });
}


export function verifyAccessToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'multi-tenant-organization-workspace',
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}
