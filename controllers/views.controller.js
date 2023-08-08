const Tour = require("../models/tour.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
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

exports.updateUserData = handleAsyncError(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user.id, {
		name: req.body.name,
		email: req.body.email,
	}, {
		new: true,
		runValidators: true,
	});

	res.status(200).render("account", {
		title: "Your account",
		user,
	});
});

exports.getMyTours = handleAsyncError(async (req, res, next) => {
	const bookings = await Booking.find({ user: req.user.id });
	const tourIDs = bookings.map(el => el.tour.id);
	const tours = await Tour.find({ _id: { $in: tourIDs } });
	res.status(200).render("overview", {
		title: "My tours",
		tours,
	});
});