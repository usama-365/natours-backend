require("dotenv").config({path: "./config.env"});
const mongoose = require("mongoose");

const app = require("./app");

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASSWORD);
const DB_NAME = process.env.DB_NAME;

mongoose.set('strictQuery', true)
    .connect(DB_CONNECTION_STRING, {dbName: DB_NAME})
    .then(() => console.log("DB connection successful!"))
    .catch(console.error);


const EXPRESS_SERVER_PORT = process.env.EXPRESS_PORT || 3000;

app.listen(EXPRESS_SERVER_PORT, () => {
    console.log(`Server is running locally on port ${EXPRESS_SERVER_PORT}`);
});