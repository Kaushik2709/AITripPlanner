import express from 'express';
import {
    createTrip,
    getMyTrips,
    getTripById,
    deleteTrip,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.route('/').post(protect, upload.none(), createTrip).get(protect, getMyTrips);
router.route('/:id').get(protect, getTripById).delete(protect, deleteTrip);

export default router;
