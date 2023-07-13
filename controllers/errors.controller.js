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

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        switch (err.name) {
            case 'CastError':
                err = handleCastErrorDB(err);
                break;
        }
        sendProductionError(err, res);
    } else if (process.env.NODE_ENV === 'development')
        sendDevelopmentError(err, res);
};