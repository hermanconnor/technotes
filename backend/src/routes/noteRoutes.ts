import { Router } from 'express';
import { createNote, getAllNotes } from '../controllers/noteController.js';

const router = Router();

router.get('/', getAllNotes);

router.post('/', createNote);

export default router;
