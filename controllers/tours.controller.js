const Tour = require('../models/tours.model');
const APIResourceQueryManager = require('../utils/apiResourceQueryManager.util');

exports.aliasTopCheapTours = async (req, res, next) => {
    req.query = {
        ...req.query,
        sort: '-ratingAverage,price',
        limit: '5',
        fields: 'name,price,ratingAverage,summary,difficulty'
    }
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // Perform the API features on this model according to the query
        const toursFeatures = new APIResourceQueryManager(Tour, req.query);
        toursFeatures.filter().paginate().sort().limitFields();

        // Executing the query and sending the response
        const tours = await toursFeatures.query;
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours
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

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "successful",
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        });
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            }
        ]);

        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        });
    }
}