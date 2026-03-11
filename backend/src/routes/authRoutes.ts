import { Router } from 'express';
import { login, logout, refresh } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);

router.get('/refresh', refresh);

router.post('/logout', logout);

export default router;
