import 'dotenv/config';
import { z } from 'zod';

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
  JWT_EXPIRES_IN: z.string().default('7d'),
  BASE_URL: z.string().default('http://localhost:5000'),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(z.treeifyError(envParsed.error));
  process.exit(1);
}

export const env = envParsed.data;
