const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const handleAsyncError = require('../utils/handleAsyncError.util');
const AppError = require('../utils/appError.util');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

exports.signup = handleAsyncError(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        data: {
            user,
            token,
        }
    })
});

exports.login = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError(400, 'Please provide email and password'));
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.checkPassword(password)) {
        return next(new AppError(401, 'Incorrect email or password'));
    }

    // If everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});