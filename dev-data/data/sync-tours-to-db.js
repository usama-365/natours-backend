/**
 * This file is just a helper script that deletes all the data 
 * from the database and adds the placeholder data from tours.json file
 */
require('dotenv').config({
    path: `${__dirname}/../../config.env`
});
const mongoose = require('mongoose');
const fs = require('node:fs');
const Tour = require("../../models/tour.model");
const User = require("../../models/user.model");
const Review = require("../../models/review.model");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const DB = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB, { dbName: process.env.DB_NAME }).then(db => {
    Tour.deleteMany()
        .then(() => Tour.create(tours))
        .then(() => User.deleteMany())
        .then(() => User.create(users))
        .then(() => Review.deleteMany())
        .then(() => Review.create(reviews))
        .then(() => db.connection.close());
});