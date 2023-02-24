const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        // results: tours.length,
        data: {
            // tours: tours
        }
    });
}

exports.getTour = (req, res) => {
    const id = +req.params.id;
    // const tour = tours.find(tour => tour.id === id);
    if (tour) res.status(200).json({
        status: "successful",
        data: {
            // tour: tour
        }
    }); else res.status(404).json({
        status: "fail",
        data: {
            message: "Tour with that ID not found"
        }
    });
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
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