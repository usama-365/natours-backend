const Review = require('../models/review.model');
const handleAsyncError = require('../utils/handleAsyncError.util');
const handlerFactory = require('./handler.factory');

exports.getAllReviews = handleAsyncError(async (req, res, next) => {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        data: {
            results: reviews.length,
            reviews
        }
    });
});

exports.setReviewsTourAndUserIds = function (req, res, next) {
    if (!req.body.user) req.body.user = req.user._id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
}

exports.createReview = handlerFactory.createOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);