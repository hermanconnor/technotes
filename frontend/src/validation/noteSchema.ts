import { z } from "zod";

const noteBase = {
  user: z.string().min(1, "Please select a technician"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters")
    .trim(),
  text: z.string().min(1, "Text is required").trim(),
  completed: z.boolean().optional(),
};

export const createNoteSchema = z.object(noteBase);
export type CreateNoteFields = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema
  .partial()
  .refine(
    (data) =>
      data.title || data.text || data.user || data.completed !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );

export type UpdateNoteFields = z.infer<typeof updateNoteSchema>;
