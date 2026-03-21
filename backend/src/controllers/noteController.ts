import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import {
  deleteNoteSchema,
  noteSchema,
  updateNoteSchema,
  noteQuerySchema,
} from '../validation/noteSchema.js';
import { canAccessResource } from '../utils/authHelper.js';

export const getAllNotes = async (req: Request, res: Response) => {
  // 1. Validate
  const { search, sort, completed, page, limit } = noteQuerySchema.parse(
    req.query,
  );

  // 2. Build Query Object
  const queryObj: any = {};

  const isManagerOrAdmin = req.user?.roles.some((role) =>
    ['Manager', 'Admin'].includes(role),
  );

  if (!isManagerOrAdmin) {
    // Regular employees only see notes assigned to them
    queryObj.user = req.user?.id;
  }

  if (search) {
    // Uses the Text Index we added to the model for better performance
    queryObj.$text = { $search: search };

    // OR keep the regex if prefer partial matching
    // queryObj.$or = [
    //   { title: { $regex: search, $options: 'i' } },
    //   { text: { $regex: search, $options: 'i' } },
    // ];
  }

  if (completed !== undefined) {
    queryObj.completed = completed;
  }

  // 3. Execution
  const skip = (page - 1) * limit;

  const [notes, totalNotes] = await Promise.all([
    Note.find(queryObj)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate<{ user: { username: string } }>('user', 'username')
      .lean()
      .exec(),
    Note.countDocuments(queryObj),
  ]);

  // 4. Response
  const notesWithUser = notes.map((note) => ({
    ...note,
    username: note.user?.username || 'Deleted User',
  }));

  res.status(200).json({
    metadata: {
      total: totalNotes,
      page,
      limit,
      pages: Math.ceil(totalNotes / limit),
      hasNextPage: page * limit < totalNotes,
      hasPrevPage: page > 1,
    },
    data: notesWithUser,
  });
};

export const createNote = async (req: Request, res: Response) => {
  // 1. Validation
  const { title, text, user: bodyUserId } = noteSchema.parse(req.body);

  // 2. Authorization Logic: Determine who the note belongs to
  const isAdminOrManager = req.user?.roles.some((role) =>
    ['Admin', 'Manager'].includes(role),
  );

  // If they are Admin/Manager, use the ID provided in the request body.
  // If they are an Employee, ignore the body and force their own ID from the JWT.
  const targetUserId =
    isAdminOrManager && bodyUserId
      ? bodyUserId
      : new Types.ObjectId(req.user?.id);

  // 3. Parallelize Checks: Does the target user exist? Does the title exist?
  const [assignedUser, duplicate] = await Promise.all([
    User.findById(targetUserId).lean().exec(),
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

  // 4. Create the Note
  const note = await Note.create({
    user: targetUserId,
    title,
    text,
  });

  res.status(201).json({
    message: `New note '${title}' created and assigned to ${assignedUser.username}`,
    ticketNumber: note.ticket,
  });
};

export const updateNote = async (req: Request, res: Response) => {
  // 1. Validation
  const {
    id,
    title,
    text,
    completed,
    user: bodyUserId,
  } = updateNoteSchema.parse(req.body);

  // 2. Find the note
  const note = await Note.findById(id).exec();
  if (!note) return res.status(404).json({ message: 'Note not found' });

  // 3. Authorization: Can this user even touch this note?
  if (!canAccessResource(req, note.user.toString())) {
    return res.status(403).json({
      message: 'Unauthorized: You can only edit notes assigned to you',
    });
  }

  // 4. Role-Based Logic for Reassignment
  const isAdminOrManager = req.user?.roles.some((role) =>
    ['Admin', 'Manager'].includes(role),
  );

  // Only Admins/Managers can change who the note is assigned to
  if (bodyUserId && isAdminOrManager) {
    note.user = bodyUserId;
  }

  // 5. Title Duplicate Check (only if title is changing)
  if (title && title !== note.title) {
    const duplicate = await Note.findOne({ title })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: 'A note with this title already exists' });
    }

    note.title = title;
  }

  // 6. Update other fields
  if (text) {
    note.text = text;
  }

  if (completed !== undefined) {
    note.completed = completed;
  }

  // 7. Save (This triggers the Mongoose validation and pre-save hooks if any)
  const updatedNote = await note.save();

  res.status(200).json({
    message: `Note '${updatedNote.title}' updated successfully`,
    note: updatedNote,
  });
};

export const deleteNote = async (req: Request, res: Response) => {
  // 1. Validation (Extract ID from body)
  const { id } = deleteNoteSchema.parse(req.body);

  // 2. Find the note
  const note = await Note.findById(id).exec();

  if (!note) return res.status(404).json({ message: 'Note not found' });

  // 3. Authorization: Ownership/Role Guard
  // Only the assigned user, a Manager, or an Admin can delete this.
  if (!canAccessResource(req, note.user.toString())) {
    return res.status(403).json({
      message: 'Unauthorized: You do not have permission to delete this note',
    });
  }

  // 4. Final Execution
  const noteTitle = note.title; // Capture for the response message
  await note.deleteOne();

  res.status(200).json({
    message: `Note '${noteTitle}' with ID ${id} deleted successfully`,
  });
};
