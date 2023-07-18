const User = require("../models/user.model");

const AppError = require("../utils/appError.util");
const handleAsyncError = require("../utils/handleAsyncError.util");
const handlerFactory = require("./handler.factory");

const filterRequestBody = (requestBody, ...keysToFilter) => {
    // Create a new object, that only contains keys that are to be filtered
    const filteredBody = {};
    keysToFilter.forEach(key => {
        if (requestBody[key])
            filteredBody[key] = requestBody[key];
    });
    return filteredBody;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}

exports.updateCurrentUser = handleAsyncError(async (req, res, next) => {
    // Password change shouldn't be allowed
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError(400, 'This route is not for updating password. Please use /updatePassword instead.'));

    // Only allow non-sensitive fields update
    const filteredBody = filterRequestBody(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        runValidators: true,
        new: true
    });

    // Return the updated user
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteCurrentUser = handleAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({
        status: 'success',
        data: null
    });
});


exports.createUser = (req, res, next) => {
    next(new AppError(400, 'Please use signup.'));
};

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOne(User);

// ALERT: Do not update password using this, it won't be encrypted
exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);