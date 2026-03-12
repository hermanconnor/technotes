import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

interface MyTokenPayload extends JwtPayload {
  userInfo: {
    id: string;
    username: string;
    roles: ('Employee' | 'Manager' | 'Admin')[];
  };
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // 1. Verify the token
    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET,
    ) as MyTokenPayload;

    // 2. Attach decoded info
    req.user = {
      id: decoded.userInfo.id,
      username: decoded.userInfo.username,
      roles: decoded.userInfo.roles,
    };

    next();
  } catch (err) {
    // 3. Catch errors (Expired, Invalid signature, etc.)
    return res.status(403).json({ message: 'Forbidden' });
  }
};
