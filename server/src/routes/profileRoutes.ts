import { Router } from 'express';
import { getProfile, updateProfile, uploadProfileImage, deleteProfile } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// All routes here are protected
router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);
router.post('/image', upload.single('image'), uploadProfileImage);

export default router;
