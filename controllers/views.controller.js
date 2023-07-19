exports.getOverviewPage = (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    });
};

exports.getToursPage = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
};