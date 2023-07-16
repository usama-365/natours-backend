const AppError = require('../utils/appError.util');

const sendDevelopmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

const sendProductionError = (err, res) => {
    // Operational errors are expected/trusted errors, so send limited detail
    if (err.isOperational)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Unknown errors so generic messages
    else {
        // Log error detail and send generic message
        console.error('ERROR 🔥 ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
}

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(400, message);
}

const handleDuplicateFieldsDB = err => {
    const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
    return new AppError(400, message);
}

const handleValidationErrors = err => {
    const errors = Object.values(err.errors).map(err => err.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(400, message);
}

const handleInvalidSignatureError = err => new AppError(401, 'Invalid token. Please login correctly.');

const handleTokenExpiredError = err => new AppError(401, 'Token has expired. Please login again.');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError')
            err = handleCastErrorDB(err);
        else if (err.code === 11000)
            err = handleDuplicateFieldsDB(err);
        else if (err.name === 'ValidationError')
            err = handleValidationErrors(err);
        else if (err.name === 'JsonWebTokenError')
            err = handleInvalidSignatureError(err);
        else if (err.name === 'TokenExpiredError')
            err = handleTokenExpiredError(err);
        sendProductionError(err, res);
    } else if (process.env.NODE_ENV === 'development')
        sendDevelopmentError(err, res);
};