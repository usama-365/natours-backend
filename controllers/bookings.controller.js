const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handleAsyncError = require("../utils/handleAsyncError.util");
const Tour = require("../models/tour.model");

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
		success_url: `${req.protocol}://${req.get("host")}/`,
		cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourID,
		payment_method_types: [ "card" ],
	});
	// 3) Create session as response
	res.status(200).json({
		status: "success",
		data: {
			session,
		},
	});
});