const Review = require('../models/review.model');
const handleAsyncError = require('../utils/handleAsyncError.util');

exports.getAllReviews = handleAsyncError(async (req, res, next) => {
    const reviews = await Review.find();

    // The populated tour field automatically selects the guides field due to a pre-find hook
    // Even the select during population only selects the name field
    // So current workaround is to remove it manually from query result
    reviews.forEach(review => {
        if (review.tour) review.tour.guides = undefined;
    });

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