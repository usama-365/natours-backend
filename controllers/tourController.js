const fs = require("node:fs");

const TOURS_FILE_PATH = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(TOURS_FILE_PATH).toString());

exports.requestBodyNameAndPriceValidator = (req, res, next) => {
    if (!req.body.price || !req.body.name)
        return res.status(400).json({
            status: "fail",
            message: "Missing name and/or price"
        });
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

exports.getTour = (req, res) => {
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
}

exports.createTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "todo",
        message: "Feature hasn't been implemented yet"
    });
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: "successful",
        data: null
    });
}