const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const tourRouter = require("./routers/tours.router");
const userRouter = require("./routers/users.router");
const AppError = require('./utils/appError.util');
const globalErrorHandler = require('./controllers/errors.controller');

const app = express();

// Global middleware
// Setting HTTP response headers
app.use(helmet());
// Dev logging
process.env.NODE_ENV === 'development' && app.use(morgan("dev"));
// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// Body parsing
app.use(express.json({
    limit: '10kb'
}));
// Static file serving
app.use(express.static(`${__dirname}/public`));

// Mounting routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Invalid route
app.all('*', (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handler
app.use(globalErrorHandler);

module.exports = app;