const Tour = require('../models/tour.model');
const handleAsyncError = require('../utils/handleAsyncError.util');

exports.getOverviewPage = handleAsyncError(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getToursPage = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
};