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
const reviewsRouter = require('./reviews.router');

const router = express.Router();

// Mounting review router
router.use('/:tourId/reviews', reviewsRouter);

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

module.exports = router;