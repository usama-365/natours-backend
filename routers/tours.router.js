const express = require("express");
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopCheapTours,
    getTourStats, getMonthlyPlan,
} = require("../controllers/tours.controller");
const { authenticate, authorizeTo } = require("../controllers/authentication.controller");
const { createReview } = require("../controllers/reviews.controller");

const router = express.Router();

router.route('/top-5-cheap')
    .get(aliasTopCheapTours, getAllTours);

router.route('/stats')
    .get(getTourStats);

router.route('/monthly-plan/:year')
    .get(getMonthlyPlan);

router.route("/")
    .get(authenticate, getAllTours)
    .post(createTour);

router.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(authenticate, authorizeTo('admin', 'lead-guide'), deleteTour);

// Review related nested routes
router.route("/:tourId/reviews")
    .post(authenticate, authorizeTo('user'), createReview);

module.exports = router;