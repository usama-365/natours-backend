class AppError extends Error {
    constructor(statusCode, errorMessage) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // To distinguish it from other type of errors
        this.isOperational = true;
        // To allow capturing stack trace excluding the constructor
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;