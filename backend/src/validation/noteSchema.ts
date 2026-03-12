import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ID format',
});

export const noteSchema = z.object({
  user: objectIdSchema,
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters')
    .trim(),
  text: z.string().min(1, 'Text is required').trim(),
  completed: z.boolean().optional(),
});

export const updateNoteSchema = z
  .object({
    id: objectIdSchema,
    user: objectIdSchema.optional(),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be under 100 characters')
      .trim()
      .optional(),
    text: z.string().min(1, 'Text is required').trim().optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title || data.text || data.user || data.completed !== undefined,
    {
      message: 'At least one field must be provided for update',
    },
  );
