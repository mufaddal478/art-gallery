const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const {
    getProfile,
    updateProfile,
    updatePassword,
    updateAvatar,
    toggleFavorite
} = require('../controllers/profile');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only (jpeg, jpg, png)!'));
        }
    }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail()
    ]
], updateProfile);

// @route   PUT /api/profile/password
// @desc    Update password
// @access  Private
router.put('/password', [
    auth,
    [
        check('currentPassword', 'Current password is required').not().isEmpty(),
        check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ]
], updatePassword);

// @route   PUT /api/profile/avatar
// @desc    Update avatar
// @access  Private
router.put('/avatar', auth, upload.single('avatar'), updateAvatar);

// @route   PUT /api/profile/favorites/:artworkId
// @desc    Toggle favorite artwork
// @access  Private
router.put('/favorites/:artworkId', auth, toggleFavorite);

module.exports = router;
