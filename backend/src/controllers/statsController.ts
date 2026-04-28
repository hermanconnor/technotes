import type { Request, Response } from 'express';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  const [
    totalNotes,
    openNotes,
    completedNotes,
    totalEmployees,
    inactiveEmployees,
    activeEmployees,
  ] = await Promise.all([
    Note.countDocuments(),
    Note.countDocuments({ completed: false }),
    Note.countDocuments({ completed: true }),
    User.countDocuments(),
    User.countDocuments({ active: false }),
    User.countDocuments({ active: true }),
  ]);

  res.status(200).json({
    totalNotes,
    openNotes,
    completedNotes,
    totalEmployees,
    inactiveEmployees,
    activeEmployees,
  });
};
