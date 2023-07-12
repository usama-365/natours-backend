const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routers/tours.router");
const userRouter = require("./routers/users.router");

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
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl}`
    // });
    const err = new Error(`Can't find ${req.originalUrl}`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;