import { z } from 'zod';
import { Types } from 'mongoose';

export const noteSchema = z.object({
  user: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid User ID format',
  }),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters')
    .trim(),
  text: z.string().min(1, 'Text is required').trim(),
  completed: z.boolean().optional(),
});
