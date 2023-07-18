const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!'],
    },
    rating: {
        type: Number,
        min: [1, 'Review rating should be at least 1.'],
        max: [5, 'Review rating should be at most 5.'],
        required: [true, 'Rating cannot be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.'],
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.'],
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;