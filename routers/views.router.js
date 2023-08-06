const express = require("express");
const {
	getOverviewPage,
	getTourPage,
} = require("../controllers/views.controller");

const router = express.Router();

router.get("/", getOverviewPage);
router.get("/tour/:slug", getTourPage);

module.exports = router;