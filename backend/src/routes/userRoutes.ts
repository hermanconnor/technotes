import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  register,
  updateUser,
} from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/register', register);
router.patch('/', updateUser);
router.delete('/', deleteUser);

export default router;
