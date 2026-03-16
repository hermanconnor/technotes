import { Router } from 'express';
import { login, logout, refresh } from '../controllers/authController.js';
import loginLimiter from '../middleware/loginLimiter.js';

const router = Router();

router.post('/login', loginLimiter, login);

router.get('/refresh', refresh);

router.post('/logout', logout);

export default router;
