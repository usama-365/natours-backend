module.exports = function (asyncFunction)  {
    return function (req, res, next) {
        // In case of error, provide it to next so express calls the error handling middleware on it
        asyncFunction(req, res, next).catch(next);
    }
};