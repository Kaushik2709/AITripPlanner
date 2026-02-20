import express from 'express';
import { registerUser, authUser } from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('profileImage'), registerUser);
router.post('/login', authUser);

export default router;
