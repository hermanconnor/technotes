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
