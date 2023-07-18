const APIResourceQueryManager = require("../utils/apiResourceQueryManager.util");
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

exports.updateOne = Model => handleAsyncError(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedDoc) return next(new AppError(404, 'No document found with that ID'));

    res.status(200).json({
        status: "successful",
        data: {
            document: updatedDoc
        }
    });
});

exports.createOne = Model => handleAsyncError(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: doc
        }
    });
});

exports.getOne = (Model, populateOptions) => handleAsyncError(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const document = await query;

    if (!document) return next(new AppError(404, 'No document found with that ID'));

    res.status(200).json({
        status: "successful",
        data: {
            document
        }
    });
});

exports.getAll = (Model) => handleAsyncError(async (req, res) => {
    // Not the most correct implementation
    // Workaround for tour's nested review route
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    // Perform the API features on this model according to the query
    const modelFeatures = new APIResourceQueryManager(Model.find(filter), req.query);
    modelFeatures.filter().paginate().sort().limitFields();

    // Executing the query and sending the response
    const documents = await modelFeatures.query;
    res.status(200).json({
        status: "success",
        data: {
            results: documents.length,
            documents
        }
    });
});