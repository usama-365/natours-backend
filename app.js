const express = require("express");
const fs = require("node:fs");

const PORT = 3000;
const TOURS_FILE_PATH = `${__dirname}/dev-data/data/tours-simple.json`;

const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(TOURS_FILE_PATH).toString());

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    });
});

app.get("/api/v1/tours/:id", (req, res) => {
    const id = +req.params.id;
    const tour = tours.find(tour => tour.id === id);
    if (tour) res.status(200).json({
        status: "successful",
        data: {
            tour: tour
        }
    }); else res.status(404).json({
        status: "fail",
        data: {
            message: "Tour with that ID not found"
        }
    });
});

app.post("/api/v1/tours", (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newID,
        ...req.body
    };
    tours.push(newTour);
    fs.writeFile(TOURS_FILE_PATH, JSON.stringify(tours), () => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });
});

app.patch("/api/v1/tours/:id", (req, res) => {
    res.status(200).json({
        status: "todo",
        message: "Feature hasn't been implemented yet"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
});