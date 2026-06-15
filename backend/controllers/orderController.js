const ORDERMODEL = require('../models/orderModel');
const CARTMODEL = require('../models/cartModel');

// Create order from cart
exports.createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress, paymentMethod } = req.body;

        // Get user's cart with product details
        const cart = await CARTMODEL.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Map cart items to order items format (matching the model)
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const newOrder = new ORDERMODEL({
            user: userId,
            items: orderItems,         // ✅ matches model field name
            totalAmount: cart.totalPrice,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD'
        });

        await newOrder.save();

        // Clear the cart after order is placed
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await ORDERMODEL.find()
            .populate('user', 'name email')
            .populate('items.product', 'title price');   // ✅ was 'products.product'
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await ORDERMODEL.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'title price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await ORDERMODEL.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const updatedOrder = await ORDERMODEL.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};