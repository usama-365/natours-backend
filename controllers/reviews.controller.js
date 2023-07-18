const Review = require('../models/review.model');
const handleAsyncError = require('../utils/handleAsyncError.util');

exports.getAllReviews = handleAsyncError(async (req, res, next) => {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;
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
    const reviewAttributes = {
        ...req.body,
        user: req.user._id,
        tour: req.params.tourId
    };
    const review = await Review.create(reviewAttributes);
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});