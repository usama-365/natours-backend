const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
	getAccountPage,
} = require("../controllers/views.controller");
const {
	isLoggedIn,
	authenticate,
} = require("../controllers/authentication.controller");

const router = express.Router();

router.get("/me", authenticate, getAccountPage);

router.use(isLoggedIn);
router.get("/", getOverviewPage);
router.get("/tour/:slug", getTourPage);
router.get("/login", getLoginPage);

module.exports = router;