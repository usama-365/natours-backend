const express = require('express');

const { authenticate, authorizeTo } = require('../controllers/authentication.controller');
const { createReview } = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(authenticate, authorizeTo('user'), createReview);

module.exports = router;