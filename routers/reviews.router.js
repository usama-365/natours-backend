const express = require('express');

const { authenticate, authorizeTo } = require('../controllers/authentication.controller');
const { createReview, getAllReviews, deleteReview } = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(authenticate, authorizeTo('user'), createReview)
    .get(getAllReviews);

router.route('/:id')
    .delete(deleteReview);

module.exports = router;