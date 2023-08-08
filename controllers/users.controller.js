const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const User = require("../models/user.model");
const AppError = require("../utils/appError.util");
const handleAsyncError = require("../utils/handleAsyncError.util");
const handlerFactory = require("./handler.factory");

const USER_IMAGES_DIRECTORY = path.join(__dirname, "..", "public", "img", "users");
// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, path.join(__dirname, "..", "public", "img", "users"));
// 	},
// 	filename: (req, file, cb) => {
// 		const extension = file.mimetype.split("/")[1];
// 		cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
// 	},
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError(400, "Not an image! Please upload only images"), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.parsePhoto = upload.single("photo");

exports.processPhoto = handleAsyncError(async (req, res, next) => {
	if (!req.file) return next();
	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(path.join(USER_IMAGES_DIRECTORY, req.file.filename));
	next();
});

const filterRequestBody = (requestBody, ...keysToFilter) => {
	// Create a new object, that only contains keys that are to be filtered
	const filteredBody = {};
	keysToFilter.forEach(key => {
		if (requestBody[key]) {
			filteredBody[key] = requestBody[key];
		}
	});
	return filteredBody;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user._id;
	next();
};

exports.updateCurrentUser = handleAsyncError(async (req, res, next) => {
	// Password change shouldn't be allowed
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError(400, "This route is not for updating password. Please use /updatePassword instead."));
	}

	// Only allow non-sensitive fields update
	const filteredBody = filterRequestBody(req.body, "name", "email");

	// Also extract photo
	if (req.file) filteredBody.photo = req.file.filename;

	const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
		runValidators: true,
		new: true,
	});

	// Return the updated user
	res.status(200).json({
		status: "success",
		data: {
			user,
		},
	});
});

exports.deleteCurrentUser = handleAsyncError(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user._id, { active: false });
	res.status(200).json({
		status: "success",
		data: null,
	});
});

exports.createUser = (req, res, next) => {
	next(new AppError(400, "Please use signup."));
};

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOne(User);

// ALERT: Do not update password using this, it won't be encrypted
exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);