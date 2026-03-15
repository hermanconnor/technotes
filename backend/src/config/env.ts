import 'dotenv/config';
import { z } from 'zod';
import { logger } from '../middleware/logger.js';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(10, 'ACCESS_TOKEN_SECRET must be at least 10 chars'),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(10, 'REFRESH_TOKEN_SECRET must be at least 10 chars'),
  BASE_URL: z.string().default('http://localhost:5000'),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  logger.error('❌ Invalid environment variables:');
  logger.error(z.treeifyError(envParsed.error));
  process.exit(1);
}

export const env = envParsed.data;
