const express = require("express");
const fs = require("node:fs");

const PORT = 3000;

const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString());

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
});