const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/artworks');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});

// Import controllers
const {
    getArtworks,
    getArtwork,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    getFeaturedArtworks,
    addArtworkReview,
    getArtworkReviews
} = require('../controllers/artworks');

// Public routes
router.get('/', getArtworks);
router.get('/featured', getFeaturedArtworks);
router.get('/:id', getArtwork);
router.get('/:id/reviews', getArtworkReviews);

// Protected routes (requires authentication)
router.post('/:id/reviews', auth, addArtworkReview);

// Admin only routes
router.post('/', auth, auth.authorize('admin'), upload.array('images', 5), createArtwork);
router.put('/:id', auth, auth.authorize('admin'), upload.array('images', 5), updateArtwork);
router.delete('/:id', auth, auth.authorize('admin'), deleteArtwork);

module.exports = router;
