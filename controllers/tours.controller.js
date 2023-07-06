const Tour = require('../models/tours.model');

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
        // Removing the non-attribute params from the GET query params
        let queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Adding the $ in front of gte, lte, gt, lt params of query object
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObj = JSON.parse(queryString);

        // Building the query
        let query = Tour.find(queryObj);

        // Custom or default sorting
        const sortCriteria = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';
        query.sort(sortCriteria);

        // Projection (Field limiting or custom fields)
        const selectCriteria = req.query.fields ? req.query.fields.split(',').join(' ') : '-__v';
        query.select(selectCriteria);

        // Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 100;
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);

        // Executing the query and sending the response
        const tours = await query;
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