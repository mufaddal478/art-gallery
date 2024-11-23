const Order = require('../models/Order');
const Artwork = require('../models/Artwork');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentInfo } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const artwork = await Artwork.findById(item.artwork);
            if (!artwork) {
                return res.status(404).json({
                    success: false,
                    message: `Artwork not found with id ${item.artwork}`
                });
            }

            if (!artwork.inStock || artwork.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for artwork ${artwork.title}`
                });
            }

            orderItems.push({
                artwork: item.artwork,
                quantity: item.quantity,
                price: artwork.price
            });

            totalAmount += artwork.price * item.quantity;

            // Update artwork quantity
            artwork.quantity -= item.quantity;
            if (artwork.quantity === 0) {
                artwork.inStock = false;
            }
            await artwork.save();
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentInfo,
            totalAmount,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query;
        const query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.artwork', 'title price images')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.artwork', 'title price images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.artwork', 'title price images')
            .sort('-createdAt');

        res.json({
            success: true,
            data: orders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled in current status'
            });
        }

        // Return items to stock
        for (const item of order.items) {
            const artwork = await Artwork.findById(item.artwork);
            if (artwork) {
                artwork.quantity += item.quantity;
                artwork.inStock = true;
                await artwork.save();
            }
        }

        order.status = 'cancelled';
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getMyOrders,
    cancelOrder
};
