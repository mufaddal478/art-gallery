const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: String
    }],
    category: {
        type: String,
        required: true,
        enum: ['painting', 'sculpture', 'photography', 'digital', 'other']
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: {
            type: String,
            enum: ['cm', 'inch'],
            default: 'cm'
        }
    },
    medium: String,
    year: Number,
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    tags: [String]
}, {
    timestamps: true
});

// Calculate average rating before saving
artworkSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    }
    next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);
module.exports = Artwork;
