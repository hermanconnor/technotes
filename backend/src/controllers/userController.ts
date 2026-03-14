import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Note } from '../models/Note.js';
import {
  deleteUserSchema,
  registerSchema,
  updateUserSchema,
} from '../validation/userSchema.js';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find()
    .select('-password')
    .sort({ username: 1 }) // list users alphabetically
    .lean()
    .exec();

  if (!users || users.length === 0) return res.status(200).json([]);

  res.status(200).json(users);
};

export const register = async (req: Request, res: Response) => {
  // 1. Validate (Throws ZodError if fails)
  const { username, password, roles } = registerSchema.parse(req.body);

  // 2. Check for existing user
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // 3. Create (Throws MongooseError if fails)
  const user = await User.create({ username, password, roles });

  // 4. Success Response
  // We only reach this line if Create was successful.
  res.status(201).json({
    message: `New user ${username} created`,
    id: user._id,
  });
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

  res
    .status(200)
    .json({ message: `User ${updatedUser.username} updated successfully` });
};

export const deleteUser = async (req: Request, res: Response) => {
  // 1. Validation
  const { id } = deleteUserSchema.parse(req.body);

  // 2. Prevent Self-Deletion
  // We compare the ID from the URL/Body with the ID from the JWT
  if (req.user?.id === id.toString()) {
    return res
      .status(403)
      .json({ message: 'Admins cannot delete their own account' });
  }

  // 3. Check for assigned notes
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({
      message: 'User has assigned notes. Reassign them before deleting.',
    });
  }

  // 4. Final Find and Delete
  const user = await User.findById(id).exec();
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();

  res.status(200).json({
    message: `Username ${user.username} with ID ${user._id} deleted`,
  });
};
