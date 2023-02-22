const express = require("express");
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    requestBodyNameAndPriceValidator
} = require("../controllers/tourController");

const router = express.Router();

router.route("/")
    .get(getAllTours)
    .post(requestBodyNameAndPriceValidator, createTour);

router.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;