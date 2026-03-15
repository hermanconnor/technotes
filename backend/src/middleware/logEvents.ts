import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';

export const logEvents = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method}\t${req.headers.origin}\t${req.url}`);
  next();
};
