const CARTMODEL = require('../models/cartModel');
const PRODUCTMODEL = require('../models/productModel');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        const product = await PRODUCTMODEL.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await CARTMODEL.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = new CARTMODEL({ user: userId, items: [], totalPrice: 0 });
        }

        const existingIndex = cart.items.findIndex(
            item => item.product._id.toString() === productId
        );

        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
            await cart.populate('items.product');
        }

        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);

        await cart.save();
        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// Get logged-in user's cart
exports.getMyCart = async (req, res) => {
    try {
        const cart = await CARTMODEL
            .findOne({ user: req.user.id })
            .populate('items.product', 'title price images');

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const cart = await CARTMODEL
            .findOne({ user: userId })
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await CARTMODEL.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};