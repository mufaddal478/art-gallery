const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getMyOrders,
    cancelOrder
} = require('../controllers/orders');

// User routes
router.post('/', auth, createOrder);
router.get('/myorders', auth, getMyOrders);
router.put('/:id/cancel', auth, cancelOrder);

// Admin routes
router.get('/', auth, auth.authorize('admin'), getOrders);
router.get('/:id', auth, auth.authorize('admin'), getOrder);
router.put('/:id/status', auth, auth.authorize('admin'), updateOrderStatus);

module.exports = router;
