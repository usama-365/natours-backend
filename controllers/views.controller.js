const Tour = require("../models/tour.model");
const handleAsyncError = require("../utils/handleAsyncError.util");

exports.getOverviewPage = handleAsyncError(async (req, res) => {
	const tours = await Tour.find();
	res.status(200).render("overview", {
		title: "All tours",
		tours,
	});
});

exports.getTourPage = handleAsyncError(async (req, res) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	res.status(200).render("tour", {
		title: tour.name,
		tour,
	});
});

exports.getLoginPage = (req, res) => {
	res.status(200).render("login", {
		title: "Login to your account",
	});
};