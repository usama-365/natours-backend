const express = require('express');
const { getAllReviews, createReview } = require('../controllers/reviews.controller');
const { authenticate, authorizeTo } = require('../controllers/authentication.controller');

const router = express.Router();

router.route('/')
    .get(getAllReviews)
    .post(authenticate, authorizeTo('user'), createReview);

module.exports = router;