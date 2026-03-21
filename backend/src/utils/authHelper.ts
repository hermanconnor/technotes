import type { Request } from 'express';

export const canAccessResource = (req: Request, resourceUserId: string) => {
  const isAdminOrManager = req.user?.roles.some((role) =>
    ['Admin', 'Manager'].includes(role),
  );

  // Is the user an elevated role OR the owner?
  return isAdminOrManager || resourceUserId === req.user?.id;
};
