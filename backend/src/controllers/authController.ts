import type { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt, { type JwtPayload } from 'jsonwebtoken';
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
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 7. Send access token to client
  res.json({ accessToken });
};

interface MyTokenPayload extends JwtPayload {
  username: string;
}

export const refresh = async (req: Request, res: Response) => {
  // 1. Check if the 'jwt' cookie exists
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // 2. Verify the Refresh Token
    const decoded = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    ) as MyTokenPayload;

    // 2. Find the user
    const foundUser = await User.findOne({ username: decoded.username }).exec();

    if (!foundUser || !foundUser.active) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 3. Generate a NEW Access Token
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
        roles: foundUser.roles,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' },
    );

    res.json({ accessToken });
  } catch (error) {
    // This catches expired tokens, malformed tokens, or signature mismatches
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  // 1. If no cookie exists, we're already "logged out"
  if (!cookies?.jwt) return res.sendStatus(204);

  // 2. Clear the cookie
  // Note: 'secure' and 'sameSite' should match your res.cookie settings
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  });

  // 3. Final response
  res.status(200).json({ message: 'Cookie cleared' });
};
