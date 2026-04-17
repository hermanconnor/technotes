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
