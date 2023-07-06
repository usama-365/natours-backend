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

module.exports = app;