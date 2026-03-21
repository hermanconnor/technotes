import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  register,
  updateUser,
} from '../controllers/userController.js';
import { verifyJWT } from '../middleware/verifyJwt.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(verifyRoles('Admin', 'Manager'), getAllUsers)
  .post(verifyRoles('Admin', 'Manager'), register)
  .patch(verifyRoles('Admin', 'Manager'), updateUser)
  .delete(verifyRoles('Admin'), deleteUser);

export default router;
