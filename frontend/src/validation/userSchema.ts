import { z } from "zod";

const userBase = {
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters"),
  roles: z
    .array(z.enum(["Employee", "Manager", "Admin"]))
    .min(1, "Select at least one role"),
  active: z.boolean(),
};

// Create Schema: Password is REQUIRED and min 6 chars
export const createUserSchema = z.object({
  ...userBase,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateUserFields = z.infer<typeof createUserSchema>;

// Edit Schema: Password is OPTIONAL.
// If provided, it must be 6+ chars OR an empty string.
export const editUserSchema = z
  .object({
    ...userBase,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .or(z.literal("")), // Allows empty string to pass validation
  })
  .partial()
  .refine(
    (data) => {
      return (
        data.username ||
        (data.password && data.password.length > 0) ||
        data.roles ||
        data.active !== undefined
      );
    },
    {
      message: "At least one field must be provided for update",
    },
  );

export type EditUserFields = z.infer<typeof editUserSchema>;
