const express = require('express');

const { authenticate, authorizeTo } = require('../controllers/authentication.controller');
const { createReview, getAllReviews, deleteReview, updateReview } = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(authenticate, authorizeTo('user'), createReview)
    .get(getAllReviews);

router.route('/:id')
    .delete(deleteReview)
    .patch(updateReview);

module.exports = router;