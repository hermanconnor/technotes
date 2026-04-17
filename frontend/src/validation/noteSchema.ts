import { z } from "zod";

export const createNoteSchema = z.object({
  user: z.string().min(1, "Please select a technician"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters")
    .trim(),
  text: z.string().min(1, "Text is required").trim(),
  completed: z.boolean().optional(),
});

export type CreateNoteFields = z.infer<typeof createNoteSchema>;
