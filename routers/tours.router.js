const express = require("express");
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopCheapTours,
    getTourStats, getMonthlyPlan, getToursWithin,
} = require("../controllers/tours.controller");
const { authenticate, authorizeTo } = require("../controllers/authentication.controller");
const reviewsRouter = require('./reviews.router');

const router = express.Router();

// Mounting review router
router.use('/:tourId/reviews', reviewsRouter);

router.route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(getToursWithin);

router.route('/top-5-cheap')
    .get(aliasTopCheapTours, getAllTours);

router.route('/stats')
    .get(getTourStats);

router.route('/monthly-plan/:year')
    .get(authenticate, authorizeTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route("/")
    .get(getAllTours)
    .post(authenticate, authorizeTo('admin', 'lead-guide'), createTour);

router.route("/:id")
    .get(getTour)
    .patch(authenticate, authorizeTo('admin', 'lead-guide'), updateTour)
    .delete(authenticate, authorizeTo('admin', 'lead-guide'), deleteTour);

module.exports = router;