const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');

const tourRouter = require("./routers/tours.router");
const userRouter = require("./routers/users.router");
const AppError = require('./utils/appError.util');
const globalErrorHandler = require('./controllers/errors.controller');

const app = express();

// Global middlewares
process.env.NODE_ENV === 'development' && app.use(morgan("dev"));
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(express.json());
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