import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/noteController.js';
import { verifyJWT } from '../middleware/verifyJwt.js';

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;
