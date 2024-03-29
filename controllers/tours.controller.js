const multer = require("multer");
const sharp = require("sharp");

const Tour = require("../models/tour.model");
const AppError = require("../utils/appError.util");
const handleAsyncError = require("../utils/handleAsyncError.util");
const handlerFactory = require("./handler.factory");
const path = require("path");

const TOURS_IMAGES_DIRECTORY = path.join(__dirname, "..", "public", "img", "tours");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, next) => {
	if (file.mimetype.startsWith("image")) {
		next(null, true);
	} else {
		next(new AppError(400, "Not an image file. Please upload images only"), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.parseTourImagesAndCover = upload.fields([
	{
		name: "imageCover",
		maxCount: 1,
	},
	{
		name: "images",
		maxCount: 3,
	},
]);

exports.processTourImagesAndCover = handleAsyncError(async (req, res, next) => {
	if (!req.files?.imageCover || !req.files?.images) return next();
	const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(path.join(TOURS_IMAGES_DIRECTORY, imageCoverFilename));
	req.body.imageCover = imageCoverFilename;
	req.body.images = [];
	await Promise.all(req.files.images.map(async (file, i) => {
		const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
		await sharp(file.buffer)
			.resize(2000, 1333)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(path.join(TOURS_IMAGES_DIRECTORY, filename));
		req.body.images.push(filename);
	}));
	next();
});

exports.aliasTopCheapTours = async (req, res, next) => {
	req.query = {
		...req.query,
		sort: "-ratingAverage,price",
		limit: "5",
		fields: "name,price,ratingAverage,summary,difficulty",
	};
	next();
};

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOne(Tour, "reviews");

exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = handleAsyncError(async (req, res) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: {
				avgPrice: 1,
			},
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

exports.getMonthlyPlan = handleAsyncError(async (req, res) => {
	const year = +req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numToursStart: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: { month: "$_id" },
		},
		{
			$project: { _id: 0 },
		},
		{
			$sort: { numToursStart: -1 },
		},
	]);

	res.status(200).json({
		status: "success",
		message: {
			plan,
		},
	});
});

// GET /tours-within/:distance/center/:latlng/unit/:unit
// GET /tours-within/300/center/-40,45/unit/mi
exports.getToursWithin = handleAsyncError(async (req, res, next) => {
	const {
		distance,
		latlng,
		unit,
	} = req.params;
	const [ lat, lng ] = latlng.split(",");
	if (!lat || !lng) return next(new AppError(400, "Please provide latitude and longitude in lat,lng format"));

	// To calculate radius in radians, we have to divide the distance with the
	// radius of earth
	const radiusInRadians = distance / (unit === "mi" ? 3963.2 : 6378.1);
	const tours = await Tour.find({
		startLocation: {
			$geoWithin: {
				$centerSphere: [
					[
						lng,
						lat,
					], radiusInRadians,
				],
			},
		},
	});
	res.status(200).json({
		status: "success",
		data: {
			results: tours.length,
			tours,
		},
	});
});

exports.getDistances = handleAsyncError(async (req, res, next) => {
	const {
		latlng,
		unit,
	} = req.params;
	const [ lat, lng ] = latlng.split(",");
	if (!lat || !lng) return next(new AppError(400, "Please provide latitude and longitude in lat,lng format"));

	// Calculating the value to multiply with the distance in meters depending
	// upon unit
	const multiplier = unit === "mi" ? 0.000621371 : 0.001;
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [ +lng, +lat ],
				},
				distanceField: "distance",
				// Converting from meters to kilometers
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			results: distances.length,
			distances,
		},
	});
});