const Tour = require('../models/tour.model');
const APIResourceQueryManager = require('../utils/apiResourceQueryManager.util');
const handleAsyncError = require('../utils/handleAsyncError.util')
const AppError = require('../utils/appError.util');
const handlerFactory = require('./handler.factory');

exports.aliasTopCheapTours = async (req, res, next) => {
    req.query = {
        ...req.query,
        sort: '-ratingAverage,price',
        limit: '5',
        fields: 'name,price,ratingAverage,summary,difficulty'
    }
    next();
};

exports.getAllTours = handleAsyncError(async (req, res) => {
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
});

exports.getTour = handleAsyncError(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!tour) return next(new AppError(404, 'No tour found with that ID'));

    res.status(200).json({
        status: "successful",
        data: {
            tour: tour
        }
    });
});

exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = handleAsyncError(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
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
});

exports.getMonthlyPlan = handleAsyncError(async (req, res) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStart: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numToursStart: -1 }
        }
    ]);

    res.status(200).json({
        status: "success",
        message: {
            plan
        }
    });
});