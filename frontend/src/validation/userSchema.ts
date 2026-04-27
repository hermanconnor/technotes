import { z } from "zod";

const userBase = {
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roles: z
    .array(z.enum(["Employee", "Manager", "Admin"]))
    .min(1, "Select at least one role"),
  active: z.boolean(),
};

export const createUserSchema = z.object(userBase);
export type CreateUserFields = z.infer<typeof createUserSchema>;

export const editUserSchema = createUserSchema.partial().refine(
  (data) => {
    // Ensure at least one field has a value that isn't undefined or an empty password
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
