const express = require('express');

const { authenticate, authorizeTo } = require('../controllers/authentication.controller');
const { createReview, getAllReviews, deleteReview, updateReview, setReviewsTourAndUserIds, getReview } = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(authenticate, authorizeTo('user'), setReviewsTourAndUserIds, createReview)
    .get(getAllReviews);

router.route('/:id')
    .get(getReview)
    .delete(deleteReview)
    .patch(updateReview);

module.exports = router;