const User = require('../models/user.model');
const handleAsyncError = require('../utils/handleAsyncError.util');

exports.signup = handleAsyncError(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
});