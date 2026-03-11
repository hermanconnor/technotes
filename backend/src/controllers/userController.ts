import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { registerSchema } from '../validation/userSchema.js';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find()
    .select('-password')
    .sort({ username: 1 }) // list users alphabetically
    .lean()
    .exec();

  if (!users.length) {
    return res.status(404).json({ message: 'No users found' });
  }

  res.json(users);
};

export const register = async (req: Request, res: Response) => {
  // 1. Validate the request body
  const { username, password, roles } = registerSchema.parse(req.body);

  // 2. Check for existing user (prevent duplicates)
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 }) // Case-insensitive check
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // 3. Create and store new user
  // Password will be hashed by the pre-save hook in the User model
  const user = await User.create({ username, password, roles });

  if (user) {
    res
      .status(201)
      .json({ message: `New user ${username} created`, id: user._id });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
};
