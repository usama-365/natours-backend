const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const handleAsyncError = require('../utils/handleAsyncError.util');
const AppError = require('../utils/appError.util');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

exports.signup = handleAsyncError(async (req, res, next) => {
    const { name, email, password, passwordConfirm, passwordChangedAt } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt
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

exports.authenticate = handleAsyncError(async (req, res, next) => {
    // Validating authorization header
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer') || authorization.split(' ').length != 2)
        return next(new AppError(401, `Unauthorized. Add Authorization header in request with value 'Bearer $TOKEN'.`));

    // Extracting and decoding the token from authorization header
    const token = authorization.split(' ')[1];
    const { id, iat } = jwt.verify(token, process.env.JWT_SECRET);

    // Checking if the user pointed by the token still exists
    const user = await User.findById(id);
    if (!user) return next(new AppError(401, 'The user belonging to this token does no longer exist.'));

    // Checking that the password wasn't changed after the token was issued
    if (await user.passwordWasChangedAfter(iat)) return next(new AppError(401, 'User has recently changed password. Please login again.'));

    // Everything checks out so adding user to request and forwarding
    req.user = user;
    next();
});