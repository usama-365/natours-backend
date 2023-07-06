/**
 * This file is just a helper script that deletes all the data 
 * from the database and adds the placeholder data from tours.json file
 */
require('dotenv').config({
    path: `${__dirname}/../../config.env`
});
const mongoose = require('mongoose');
const fs = require('node:fs');
const Tour = require("../../models/tours.model");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const DB = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB, { dbName: process.env.DB_NAME }).then(db => {
    Tour.deleteMany()
        .then(() => Tour.create(tours))
        .then(() => db.connection.close());
});