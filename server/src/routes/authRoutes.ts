import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/change-password', authMiddleware, changePassword);

export default router;
