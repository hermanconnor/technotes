import { Types } from 'mongoose';
import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be under 20 characters'),
  password: z
    .string({ error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  roles: z
    .array(z.enum(['Employee', 'Manager', 'Admin']))
    .optional()
    .default(['Employee']),
});

export const updateUserSchema = z
  .object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid User ID format',
    }),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be under 20 characters')
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    roles: z.array(z.enum(['Employee', 'Manager', 'Admin'])).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'At least one field must be provided for update',
  });

// export const updateUserSchema = registerSchema.partial().extend({
//   active: z.boolean().optional(),
// });
