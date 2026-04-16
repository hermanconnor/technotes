export const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "U";

  return name.trim().charAt(0).toUpperCase();
};
