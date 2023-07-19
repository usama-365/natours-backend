const Tour = require('../models/tour.model');
const AppError = require('../utils/appError.util');
const handleAsyncError = require('../utils/handleAsyncError.util')
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

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOne(Tour, 'reviews');

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

// GET /tours-within/:distance/center/:latlng/unit/:unit
// GET /tours-within/300/center/-40,45/unit/mi
exports.getToursWithin = handleAsyncError(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) return next(new AppError(400, 'Please provide latitude and longitude in lat,lng format'));

    // To calculate radius in radians, we have to divide the distance with the radius of earth
    const radiusInRadians = distance / (unit === 'mi' ? 3963.2 : 6378.1);
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radiusInRadians] } } });
    res.status(200).json({
        status: 'success',
        data: {
            results: tours.length,
            tours
        }
    });
});

exports.getDistances = handleAsyncError(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) return next(new AppError(400, 'Please provide latitude and longitude in lat,lng format'));

    // Calculating the value to multiply with the distance in meters depending upon unit
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat]
                },
                distanceField: 'distance',
                // Converting from meters to kilometers
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1,
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            results: distances.length,
            distances
        }
    })
});