const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handleAsyncError = require("../utils/handleAsyncError.util");
const Tour = require("../models/tour.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const handlerFactory = require("./handler.factory");

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
	// await Booking.create({
	// 	tour,
	// 	user,
	// 	price,
	// });
	// To remove the query string
	res.redirect(req.originalUrl.split("?")[0]);
});

exports.webhookCheckout = handleAsyncError(async (req, res, next) => {
	const sig = req.headers["stripe-signature"];

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle the event
	switch (event.type) {
	case "checkout.session.completed":
		const checkoutSessionCompleted = event.data.object;
		const user = (await User.find({ email: checkoutSessionCompleted.customer_email })).i;
		const price = checkoutSessionCompleted.line_items[0].price_data.unit_amount / 100;
		const tour = checkoutSessionCompleted.client_reference_id;
		await Booking.create({
			user,
			price,
			tour,
		});
		// Then define and call a function to handle the event
		// checkout.session.completed
		break;
		// ... handle other event types
	default:
		console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event
	res.send();
});

exports.createBooking = handlerFactory.createOne(Booking);

exports.getBooking = handlerFactory.getOne(Booking);

exports.getAllBookings = handlerFactory.getAll(Booking);

exports.updateBooking = handlerFactory.updateOne(Booking);

exports.deleteBooking = handlerFactory.deleteOne(Booking);