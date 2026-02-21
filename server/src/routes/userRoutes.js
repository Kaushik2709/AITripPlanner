import express from 'express';
import { registerUser, authUser, getProfile, updateProfile } from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', upload.single('profileImage'), registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
