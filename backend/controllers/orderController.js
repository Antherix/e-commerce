const ORDERMODEL = require('../models/orderModel');
const CARTMODEL = require('../models/cartModel');
const ADDRESSMODEL = require('../models/addressModel');

// Create order from user's cart
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddressId, paymentMethod = 'COD' } = req.body;

        // Validate address belongs to this user
        const address = await ADDRESSMODEL.findOne({ _id: shippingAddressId, user: userId });
        if (!address) {
            return res.status(404).json({ message: 'Shipping address not found' });
        }

        // Get cart with product details
        const cart = await CARTMODEL.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const newOrder = new ORDERMODEL({
            user: userId,
            items: orderItems,
            totalAmount: cart.totalPrice,
            shippingAddress: shippingAddressId,
            paymentMethod
        });

        await newOrder.save();

        // Clear cart after order placed
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        await newOrder.populate([
            { path: 'items.product', select: 'title price' },
            { path: 'shippingAddress' }
        ]);

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders for logged-in user
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await ORDERMODEL
            .find({ user: req.user.id })
            .populate('items.product', 'title price images')
            .populate('shippingAddress')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get single order by id (only if it belongs to this user)
exports.getOrderById = async (req, res) => {
    try {
        const order = await ORDERMODEL
            .findOne({ _id: req.params.id, user: req.user.id })
            .populate('items.product', 'title price images')
            .populate('shippingAddress');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Cancel order (user can only cancel if status is 'Placed')
exports.cancelOrder = async (req, res) => {
    try {
        const order = await ORDERMODEL.findOne({ _id: req.params.id, user: req.user.id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus !== 'Placed') {
            return res.status(400).json({
                message: `Cannot cancel order with status: ${order.orderStatus}`
            });
        }

        order.orderStatus = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled', order });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
};

// ── Admin only ────────────────────────────────────────────────
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await ORDERMODEL
            .find()
            .populate('user', 'name email')
            .populate('items.product', 'title price')
            .populate('shippingAddress')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await ORDERMODEL.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};