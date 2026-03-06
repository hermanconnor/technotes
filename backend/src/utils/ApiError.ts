export interface ValidationErrorDetail {
  field: string | number;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: ValidationErrorDetail[] | undefined;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details: ValidationErrorDetail[] | undefined = undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Set the prototype explicitly for extending built-in Error in TS
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // --- Static Helpers ---

  static badRequest(
    message: string,
    details?: ValidationErrorDetail[],
  ): ApiError {
    return new ApiError(400, message, true, details);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, false);
  }
}
