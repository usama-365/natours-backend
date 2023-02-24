const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: "success",
            data: {
                tours: tours
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            data: {
                message: error
            }
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "successful",
            data: {
                tour: tour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        });
    }
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

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "successful",
            data: {
                tour: updatedTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        })
    }
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: "successful",
        data: null
    });
}