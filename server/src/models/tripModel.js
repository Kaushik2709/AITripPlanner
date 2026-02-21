import mongoose from 'mongoose';

const tripSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        destination: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        budget: {
            type: String,
            required: true,
        },
        companions: {
            type: String,
            required: true,
        },
        itinerary: {
            type: Object,
            required: true,
        },
        rawAiResponse: {
            type: Object,
        }
    },
    {
        timestamps: true,
    }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
