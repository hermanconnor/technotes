import type { Request, Response } from 'express';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { noteSchema } from '../validation/noteSchema.js';

export const getAllNotes = async (req: Request, res: Response) => {
  // 1. Fetch all notes
  const notes = await Note.find()
    .populate<{ user: { username: string } }>('user', 'username')
    .lean()
    .exec();

  // 2. Check if any notes exist
  if (!notes || notes.length === 0) return res.status(200).json([]);

  // 3. Transform data for the frontend
  const notesWithUser = notes.map((note) => ({
    ...note,
    username: note.user?.username || 'Deleted User',
  }));

  res.status(200).json(notesWithUser);
};

export const createNote = async (req: Request, res: Response) => {
  // 1. Validation
  const { user, title, text } = noteSchema.parse(req.body);

  // 2. Parallelize Checks (Optional but faster)
  const [assignedUser, duplicate] = await Promise.all([
    User.findById(user).lean().exec(),
    Note.findOne({ title })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec(),
  ]);

  if (!assignedUser) {
    return res.status(404).json({ message: 'Assigned user not found' });
  }

  if (duplicate) {
    return res
      .status(409)
      .json({ message: 'A note with this title already exists' });
  }

  // 3. Create the Note
  const note = await Note.create({ user, title, text });

  return res.status(201).json({
    message: 'New note created',
    ticketNumber: note.ticket,
  });
};
