import path from 'node:path';
import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Base configuration (Formats apply to everything)
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    // ALWAYS log to the console.
    // Render will capture this automatically in production.
    new winston.transports.Console({
      format:
        env.NODE_ENV === 'production'
          ? logFormat // Clean text for production log aggregators
          : combine(colorize(), logFormat), // Colorful text for local dev
    }),
  ],
});

// ONLY log to files if we are running locally in development
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
    }),
  );
}
