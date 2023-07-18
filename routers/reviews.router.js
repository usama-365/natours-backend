const express = require('express');

const { authenticate, authorizeTo } = require('../controllers/authentication.controller');
const { createReview, getAllReviews, deleteReview, updateReview, setReviewsTourAndUserIds, getReview } = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

// Authenticated routes
router.use(authenticate);
router.route('/')
    .get(getAllReviews)
    .post(authorizeTo('user'), setReviewsTourAndUserIds, createReview);

router.route('/:id')
    .get(getReview)
    .delete(authorizeTo('user', 'admin'), deleteReview)
    .patch(authorizeTo('user', 'admin'), updateReview);

module.exports = router;