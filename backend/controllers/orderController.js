const ORDERMODEL = require('../models/orderModel');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user, products, totalAmount, shippingAddress, status } = req.body;
        const newOrder = new ORDERMODEL({ user, products, totalAmount, shippingAddress, status });

        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await ORDERMODEL.find().populate('user', 'name email').populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await ORDERMODEL.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update an order by ID
// exports.updateOrderById = async (req, res) => {
//     try {
//         const updatedOrder = await ORDERMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email').populate('products.product', 'name price');
//         if (!updatedOrder) {
//             return res.status(404).json({ message: '        Order not found' });
//         }
//         res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating order', error: error.message });
//     }
// };

// Delete an order by ID
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