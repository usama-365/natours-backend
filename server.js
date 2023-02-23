require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASSWORD);
const EXPRESS_SERVER_PORT = process.env.EXPRESS_PORT || 3000;

mongoose.set('strictQuery', true);
mongoose.connect(DB_CONNECTION_STRING);

app.listen(EXPRESS_SERVER_PORT, () => {
    console.log(`Server is running locally on port ${EXPRESS_SERVER_PORT}`);
});