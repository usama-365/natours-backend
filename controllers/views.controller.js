const Tour = require("../models/tour.model");
const handleAsyncError = require("../utils/handleAsyncError.util");
const AppError = require("../utils/appError.util");

exports.getOverviewPage = handleAsyncError(async (req, res) => {
	const tours = await Tour.find();
	res.status(200).render("overview", {
		title: "All tours",
		tours,
	});
});

exports.getTourPage = handleAsyncError(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	if (!tour) {
		return next(new AppError(404, "There is no tour with that name"));
	}

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

exports.getAccountPage = (req, res) => {
	res.status(200).render("account", {
		title: "Your Account",
	});
};

