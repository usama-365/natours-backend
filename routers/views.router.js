const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
} = require("../controllers/views.controller");

const router = express.Router();

router.get("/", getOverviewPage);
router.get("/tour/:slug", getTourPage);
router.get("/login", getLoginPage);

module.exports = router;