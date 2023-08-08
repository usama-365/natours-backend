const express = require("express");

const { getCheckoutSession } = require("../controllers/bookings.controller");
const { authenticate } = require("../controllers/authentication.controller");

const router = express.Router();

router.get(
	"/checkout-session/:tourID",
	authenticate,
	getCheckoutSession,
);

module.exports = router;