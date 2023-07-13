const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routers/tours.router");
const userRouter = require("./routers/users.router");
const AppError = require('./utils/appError.util');
const globalErrorHandler = require('./controllers/errors.controller');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
process.env.NODE_ENV === 'development' && app.use(morgan("dev"));

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