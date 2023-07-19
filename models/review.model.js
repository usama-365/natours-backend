const mongoose = require('mongoose');
const Tour = require('./tour.model');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!'],
    },
    rating: {
        type: Number,
        min: [1, 'Review rating should be at least 1.'],
        max: [5, 'Review rating should be at most 5.'],
        required: [true, 'Rating cannot be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.'],
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calculateAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                ratingsQuantity: { $sum: 1 },
                ratingsAverage: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0)
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].ratingsAverage,
            ratingsQuantity: stats[0].ratingsQuantity
        });
    else
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
};

reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (updatedOrDeletedDoc) {
    if (!updatedOrDeletedDoc) return;
    this.model.calculateAverageRating(updatedOrDeletedDoc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;