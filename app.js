const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");

const tourRouter = require("./routers/tours.router");
const userRouter = require("./routers/users.router");
const reviewRouter = require("./routers/reviews.router");
const viewsRouter = require("./routers/views.router");
const AppError = require("./utils/appError.util");
const globalErrorHandler = require("./controllers/errors.controller");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Global middleware
// Static file serving
app.use(express.static(path.join(__dirname, "public")));
// Setting HTTP response headers
app.use(helmet({
	contentSecurityPolicy: false,
	// {
	// 	directives: {
	// 		"script-src": [ "'self'", "unpkg.com", "openstreetmap.org" ],
	// 	},
	// },
}));
// Dev logging
process.env.NODE_ENV === "development" && app.use(morgan("dev"));
// Rate limiting
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
// Body parsing
app.use(express.json({
	limit: "10kb",
}));
// URL parsing
app.use(express.urlencoded({
	extended: true,
	limit: "10kb",
}));
// Cookie parsing
app.use(cookieParser());
// Data sanitization against noSQL query injection
app.use(mongoSanitize());
// Data sanitzation against XSS
app.use(xss());
// Prevent parameter pollution
app.use(hpp({
	whitelist: [
		"duration",
		"ratingsAverage",
		"ratingsQuantity",
		"maxGroupSize",
		"difficulty",
		"price",
	],
}));

// Mounting routers
app.use("/", viewsRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Invalid route
app.all("*", (req, res, next) => {
	next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handler
app.use(globalErrorHandler);

module.exports = app;