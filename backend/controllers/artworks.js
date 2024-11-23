const Artwork = require('../models/Artwork');

// @desc    Get all artworks with filtering, sorting, and pagination
// @route   GET /api/artworks
// @access  Public
const getArtworks = async (req, res) => {
    try {
        const { category, price_min, price_max, sort, page = 1, limit = 10, search } = req.query;
        const query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (price_min || price_max) {
            query.price = {};
            if (price_min) query.price.$gte = Number(price_min);
            if (price_max) query.price.$lte = Number(price_max);
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }

        const artworks = await Artwork.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Artwork.countDocuments(query);

        res.json({
            success: true,
            data: artworks,
            pagination: {
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: page,
                perPage: limit
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get featured artworks
// @route   GET /api/artworks/featured
// @access  Public
const getFeaturedArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(6);

        res.json({
            success: true,
            data: artworks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
const getArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name avatar'
                }
            })
            .populate('artist', 'name avatar bio');

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        res.json({
            success: true,
            data: artwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create artwork
// @route   POST /api/artworks
// @access  Private/Admin
const createArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.create({
            ...req.body,
            artist: req.user.id,
            images: req.files.map(file => file.filename)
        });

        res.status(201).json({
            success: true,
            data: artwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private/Admin
const updateArtwork = async (req, res) => {
    try {
        let artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        // Check if user is artwork owner or admin
        if (artwork.artist.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this artwork'
            });
        }

        // Handle image upload if new images are provided
        if (req.files && req.files.length > 0) {
            // Add new images to existing ones
            const newImages = req.files.map(file => file.filename);
            req.body.images = [...artwork.images, ...newImages];
        }

        artwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: artwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private/Admin
const deleteArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        // Check if user is artwork owner or admin
        if (artwork.artist.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this artwork'
            });
        }

        await artwork.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add review to artwork
// @route   POST /api/artworks/:id/reviews
// @access  Private
const addArtworkReview = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        // Check if user already reviewed
        if (artwork.reviews.find(review => review.user.toString() === req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this artwork'
            });
        }

        const review = {
            user: req.user.id,
            rating: req.body.rating,
            comment: req.body.comment
        };

        artwork.reviews.push(review);

        // Calculate average rating
        artwork.rating = artwork.reviews.reduce((acc, item) => item.rating + acc, 0) / artwork.reviews.length;

        await artwork.save();

        const populatedArtwork = await Artwork.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name avatar'
                }
            });

        res.status(201).json({
            success: true,
            data: populatedArtwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get artwork reviews
// @route   GET /api/artworks/:id/reviews
// @access  Public
const getArtworkReviews = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name avatar'
                }
            });

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        res.json({
            success: true,
            data: artwork.reviews
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getArtworks,
    getFeaturedArtworks,
    getArtwork,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    addArtworkReview,
    getArtworkReviews
};
