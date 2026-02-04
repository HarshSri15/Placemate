import { Request, Response, NextFunction } from 'express';
import { AppError } from '@common/errors/AppError';
import { logger } from '@config/logger.config';
import { config } from '@config/env.config';
import { ZodError } from 'zod';
import { ApiResponse } from '@common/utils/ApiResponse';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
    
    ApiResponse.error(res, 'Validation failed', 422, formattedErrors);
    return;
  }

  // Handle MongoDB duplicate key error
  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    ApiResponse.error(res, 'Resource already exists', 409);
    return;
  }

  // Handle MongoDB cast error
  if (err.name === 'CastError') {
    ApiResponse.error(res, 'Invalid ID format', 400);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    ApiResponse.error(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ApiResponse.error(res, 'Token expired', 401);
    return;
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    ApiResponse.error(res, message, statusCode, 'errors' in err ? err.errors : undefined);
    return;
  }

  // Handle unknown errors
  const statusCode = 500;
  const message = config.env === 'production' 
    ? 'Internal server error' 
    : err.message;

  ApiResponse.error(res, message, statusCode);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
};
