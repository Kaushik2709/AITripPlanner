import asyncHandler from 'express-async-handler';
import Trip from '../models/tripModel.js';
import { generateTripItinerary } from '../services/geminiService.js';

// @desc    Create new AI trip
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
    const { destination, duration, budget, companions } = req.body;

    if (!destination || !duration || !budget || !companions) {
        res.status(400);
        throw new Error('Please provide all details: destination, duration, budget, companions');
    }

    // Use Gemini to generate itinerary
    const aiResponse = await generateTripItinerary({
        destination,
        duration,
        budget,
        companions
    });

    const trip = new Trip({
        user: req.user._id,
        destination,
        duration,
        budget,
        companions,
        itinerary: aiResponse.itinerary,
        rawAiResponse: aiResponse
    });

    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
});

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
const getMyTrips = asyncHandler(async (req, res) => {
    const trips = await Trip.find({ user: req.user._id }).sort('-createdAt');
    res.json(trips);
});

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res) => {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
        if (trip.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to view this trip');
        }
        res.json(trip);
    } else {
        res.status(404);
        throw new Error('Trip not found');
    }
});

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
        if (trip.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to delete this trip');
        }
        await trip.deleteOne();
        res.json({ message: 'Trip removed' });
    } else {
        res.status(404);
        throw new Error('Trip not found');
    }
});

export { createTrip, getMyTrips, getTripById, deleteTrip };
