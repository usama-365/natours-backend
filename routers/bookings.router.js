const express = require("express");

const {
	getCheckoutSession,
	getAllBookings,
	deleteBooking,
	createBooking,
	getBooking,
	updateBooking,
} = require("../controllers/bookings.controller");
const {
	authenticate,
	authorizeTo,
} = require("../controllers/authentication.controller");

const router = express.Router();

// Below routes require logged in user
router.use(authenticate);
router.get(
	"/checkout-session/:tourID",
	getCheckoutSession,
);

// Below routes require admin access
router.use(authorizeTo("admin"));
router.route("/")
	.get(getAllBookings)
	.post(createBooking);
router.route("/:id")
	.get(getBooking)
	.patch(updateBooking)
	.delete(deleteBooking);

module.exports = router;