import type { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { loginSchema } from '../validation/authSchema.js';
import { env } from '../config/env.js';

export const login = async (req: Request, res: Response) => {
  // 1. Validation
  const { username, password } = loginSchema.parse(req.body);

  // 2. Database Lookup
  const user = await User.findOne({ username }).select('+password').exec();

  if (!user || !user.active) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 3. Password Verification
  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) return res.status(401).json({ message: 'Unauthorized' });

  // 4. Generate Access Token (Short-lived)
  const accessToken = jwt.sign(
    { username: user.username, roles: user.roles },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  );

  // 5. Generate Refresh Token (Long-lived)
  const refreshToken = jwt.sign(
    { username: user.username },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  );

  // 6. Secure Cookie Configuration
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 7. Send access token to client
  res.json({ accessToken });
};
