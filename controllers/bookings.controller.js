const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handleAsyncError = require("../utils/handleAsyncError.util");
const Tour = require("../models/tour.model");
const Booking = require("../models/booking.model");

exports.getCheckoutSession = handleAsyncError(async (req, res, next) => {
	// 1) Get the currently booked tour
	const tour = await Tour.findById(req.params.tourID);
	// 2) Create checkout session
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					product_data: {
						name: `${tour.name} Tour`,
						description: tour.summary,
						images: [
							`${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
						],
					},
					unit_amount: tour.price * 100,
					currency: "usd",
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${req.protocol}://${req.get("host")}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourID,
		payment_method_types: [ "card" ],
	});
	// 3) Create session as response
	res.redirect(303, session.url);
});

exports.createBookingCheckout = handleAsyncError(async (req, res, next) => {
	const {
		tour,
		user,
		price,
	} = req.query;
	if (!tour || !user || !price) return next();
	await Booking.create({
		tour,
		user,
		price,
	});
	// To remove the query string
	res.redirect(req.originalUrl.split("?")[0]);
});