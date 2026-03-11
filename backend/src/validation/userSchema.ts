import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be under 20 characters'),
  password: z
    .string({ error: 'Username is required' })
    .min(6, 'Password must be at least 6 characters'),
  roles: z
    .array(z.enum(['Employee', 'Manager', 'Admin']))
    .optional()
    .default(['Employee']),
});
