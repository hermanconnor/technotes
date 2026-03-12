import { Router } from 'express';
import { getAllNotes } from '../controllers/noteController.js';

const router = Router();

router.get('/', getAllNotes);

export default router;
