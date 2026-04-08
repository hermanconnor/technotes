import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { verifyJWT } from '../middleware/verifyJwt.js';

const router = Router();

router.use(verifyJWT);

router.get('/dashboard', getDashboardStats);

export default router;
