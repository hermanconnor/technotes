import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError, type ValidationErrorDetail } from '../utils/ApiError.js';
import { logger } from './logger.js';
import { env } from '../config/env.js';

interface ErrorResponse {
  success: boolean;
  message: string;
  details?: ValidationErrorDetail[];
  stack?: string;
}

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let normalizedError: ApiError;

  const isProduction = env.NODE_ENV === 'production';

  // 1. Mongoose/MongoDB Duplicate Key (11000)
  if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
    const mongoErr = err as { keyPattern?: Record<string, unknown> };
    const keys = Object.keys(mongoErr.keyPattern || {});
    const field = keys[0] || 'Field';
    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);

    normalizedError = ApiError.conflict(`${formattedField} already exists`);
  }

  // 2. Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    const details: ValidationErrorDetail[] = Object.values(err.errors).map(
      (e) => ({
        field: e.path,
        message: e.message,
      }),
    );

    normalizedError = new ApiError(
      400,
      'Data validation failed',
      true,
      details,
    );
  }

  // 3. Mongoose Cast Error
  else if (err instanceof mongoose.Error.CastError) {
    normalizedError = ApiError.notFound();
  }

  // 4. Zod Validation Error
  else if (err instanceof ZodError) {
    const details: ValidationErrorDetail[] = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    normalizedError = new ApiError(400, 'Validation failed', true, details);
  }
  // 5. Already formalized ApiError
  else if (err instanceof ApiError) {
    normalizedError = err;
  }

  // 6. Generic Native Error or unexpected values
  else {
    let statusCode = 500;
    let message = 'Internal server error';

    if (err && typeof err === 'object') {
      if ('statusCode' in err && typeof err.statusCode === 'number') {
        statusCode = err.statusCode;
      } else if ('status' in err && typeof err.status === 'number') {
        statusCode = err.status;
      }

      if ('message' in err && typeof err.message === 'string') {
        message = err.message;
      }
    }

    normalizedError = new ApiError(statusCode, message, false);
  }

  // Build response object
  const responseBody: ErrorResponse = {
    success: false,
    message: normalizedError.isOperational
      ? normalizedError.message
      : 'An unexpected error occurred',
  };

  if (normalizedError.details) {
    responseBody.details = normalizedError.details;
  }

  // Extract stack trace if it is safe and available
  if (!isProduction && err instanceof Error && err.stack) {
    responseBody.stack = err.stack;
  }

  // Log failures appropriately
  if (!isProduction || !normalizedError.isOperational) {
    logger.error(`[ERROR] ${req.method} ${req.url}:`, err);
  }

  res.status(normalizedError.statusCode).json(responseBody);
};
