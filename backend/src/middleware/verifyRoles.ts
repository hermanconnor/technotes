import type { Request, Response, NextFunction } from 'express';

export const verifyRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];
    const hasRole = req.user.roles.some((role) => rolesArray.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
