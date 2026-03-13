import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/noteController.js';

const router = Router();

router.get('/', getAllNotes);

router.post('/', createNote);

router.patch('/', updateNote);

router.delete('/', deleteNote);

export default router;
