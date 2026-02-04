import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config/env.config';
import { UnauthorizedError } from '@common/errors/AppError';
import { AuthRequest, AuthenticatedUser } from '@common/types';
import { asyncHandler } from '@common/utils/asyncHandler';

interface JwtPayload {
  id: string;
  email: string;
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // Get token from Authorization header or cookie
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      
      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
      } as AuthenticatedUser;
      
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Authentication failed');
    }
  }
);

export const optionalAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
        req.user = {
          id: decoded.id,
          email: decoded.email,
        } as AuthenticatedUser;
      } catch (error) {
        // Silently fail for optional auth
      }
    }
    
    next();
  }
);
