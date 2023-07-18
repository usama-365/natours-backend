const Review = require('../models/review.model');
const handlerFactory = require('./handler.factory');

exports.getAllReviews = handlerFactory.getAll(Review);

exports.setReviewsTourAndUserIds = function (req, res, next) {
    if (!req.body.user) req.body.user = req.user._id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
}

exports.getReview = handlerFactory.getOne(Review);

exports.createReview = handlerFactory.createOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);