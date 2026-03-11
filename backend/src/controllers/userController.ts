import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { registerSchema, updateUserSchema } from '../validation/userSchema.js';

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

export const updateUser = async (req: Request, res: Response) => {
  // 1. Validation
  const { id, username, roles, active, password } = updateUserSchema.parse(
    req.body,
  );

  // 2. Find the user
  const user = await User.findById(id).exec();
  if (!user) return res.status(404).json({ message: 'User not found' });

  // 3. Duplicate Check
  if (username && username !== user.username) {
    const duplicate = await User.findOne({ username })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    user.username = username;
  }

  // 4. Update fields only if they are provided
  if (roles) {
    user.roles = roles;
  }

  if (typeof active === 'boolean') {
    user.active = active;
  }

  if (password) {
    // Triggers our Mongoose pre-save hook, which will hash it automatically.
    user.password = password;
  }

  // 5. Save
  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated successfully` });
};
