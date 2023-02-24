require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASSWORD);
const EXPRESS_SERVER_PORT = process.env.EXPRESS_PORT || 3000;
const DB_NAME = process.env.DB_NAME;

mongoose.set('strictQuery', true);
mongoose.connect(DB_CONNECTION_STRING, { dbName: DB_NAME });

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Forest Hiker',
    rating: 4.7,
    price: 497
});

testTour.save().then(console.log).catch(console.error);

app.listen(EXPRESS_SERVER_PORT, () => {
    console.log(`Server is running locally on port ${EXPRESS_SERVER_PORT}`);
});