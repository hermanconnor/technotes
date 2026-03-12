import { Router } from 'express';
import {
  createNote,
  getAllNotes,
  updateNote,
} from '../controllers/noteController.js';

const router = Router();

router.get('/', getAllNotes);

router.post('/', createNote);

router.patch('/', updateNote);

export default router;
