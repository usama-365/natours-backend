const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('../models/user.model');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        minlength: [10, 'A tour name must have more or equal than 10 characters'],
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        // validate: [validator.isAlpha, 'Tour name can only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Price discount ({VALUE}) should be less than price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        // Not schema type option, but literally an embedded object
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
    }],
    guides: [{
        type: mongoose.ObjectId,
        ref: 'User'
    }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Document middlewares
// only runs for save and create method
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function (next) {
//     const tourGuidesPromises = this.guides.map(async guideID => await User.findById(guideID));
//     this.guides = await Promise.all(tourGuidesPromises);
//     next();
// });

// Query middlewares, run for every hook that starts with find
// hide secret tours by default
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
    // Add the aggregation criteria to exclude secret tour
    // at the beginning of the aggregation pipeline
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

module.exports = mongoose.model('Tour', tourSchema);