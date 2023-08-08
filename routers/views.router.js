const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
	getAccountPage,
	updateUserData,
} = require("../controllers/views.controller");
const {
	isLoggedIn,
	authenticate,
} = require("../controllers/authentication.controller");
const { createBookingCheckout } = require("../controllers/bookings.controller");

const router = express.Router();

router.get("/me", authenticate, getAccountPage);
router.post("/submit-user-data", authenticate, updateUserData);

router.get("/", createBookingCheckout, authenticate, getOverviewPage);

router.use(isLoggedIn);
router.get("/tour/:slug", getTourPage);
router.get("/login", getLoginPage);

module.exports = router;