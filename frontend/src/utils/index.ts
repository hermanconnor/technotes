export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "U";

  return name.trim().charAt(0).toUpperCase();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export function getRoleBadgeVariant(
  role: string,
): "default" | "secondary" | "outline" {
  switch (role) {
    case "Manager":
    case "Admin":
      return "default";
    case "Employee":
      return "secondary";
    default:
      return "outline";
  }
}
