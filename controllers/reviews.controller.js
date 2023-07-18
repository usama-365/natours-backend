const Review = require('../models/review.model');
const handleAsyncError = require('../utils/handleAsyncError.util');

exports.getAllReviews = handleAsyncError(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        data: {
            results: reviews.length,
            reviews
        }
    });
});

exports.createReview = handleAsyncError(async (req, res, next) => {
    const review = await Review.create({ ...req.body });
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});