const AppError = require("../utils/appError.util");
const handleAsyncError = require("../utils/handleAsyncError.util");

exports.deleteOne = Model => handleAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError(404, 'No document found with that ID'));

    res.status(204).json({
        status: "successful",
        data: null
    });
});