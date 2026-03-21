import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError, type ValidationErrorDetail } from '../utils/ApiError.js';
import { logger } from './logger.js';
import { env } from '../config/env.js';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, any>;
}

export const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  // 1. Mongoose/MongoDB Duplicate Key (11000)
  const mongoErr = err as MongoError;

  if (mongoErr.code === 11000) {
    const keys = Object.keys(mongoErr.keyPattern || {});
    const field = keys[0] || 'Field';

    error = ApiError.conflict(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    );
  }

  // 2. Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    const details: ValidationErrorDetail[] = Object.values(err.errors).map(
      (e: any) => ({
        field: e.path,
        message: e.message,
      }),
    );

    error = new ApiError(400, 'Data validation failed', true, details);
  }

  // 3. Mongoose Cast Error
  else if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, 'Resource not found');
  }

  // 4. Zod Validation Error
  else if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    error = new ApiError(400, 'Validation failed', true, details);
  }

  // 5. Final Normalization
  // Use "in" operator or type casting to check for status codes on generic Errors
  if (!(error instanceof ApiError)) {
    const statusCode =
      (error as any).statusCode || (error as any).status || 500;
    const message = error.message || 'Internal server error';

    error = new ApiError(statusCode, message, false);
  }

  // Cast back to ApiError for the response logic since we've guaranteed it above
  const finalError = error as ApiError;

  const responseBody = {
    success: false,
    message: finalError.isOperational
      ? finalError.message
      : 'An unexpected error occurred',
    ...(finalError.details && { details: finalError.details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (env.NODE_ENV === 'development' || !finalError.isOperational) {
    logger.error(`[ERROR] ${req.method} ${req.url}:`, err);
  }

  res.status(finalError.statusCode).json(responseBody);
};
