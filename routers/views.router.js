const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
} = require("../controllers/views.controller");
const { isLoggedIn } = require("../controllers/authentication.controller");

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getOverviewPage);
router.get("/tour/:slug", getTourPage);
router.get("/login", getLoginPage);

module.exports = router;