const CARTMODEL = require('../models/cartModel');
const USERMODEL = require('../models/userModel');
const PRODUCTMODEL = require('../models/productModel');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate user and product existence
        const user = await USERMODEL.findById(userId);
        const product = await PRODUCTMODEL.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: 'User or Product not found' });
        }

        // Find or create cart for the user
        let cart = await CARTMODEL.findOne({ user: userId });

        if (!cart) {
            cart = new CARTMODEL({ user: userId, items: [], totalPrice: 0 });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex >= 0) {
            // Update quantity and total price
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.items.push({ product: productId, quantity });
        }

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            const itemTotal = item.quantity * product.price; // Assuming product has a price field
            return total + itemTotal;
        }, 0);

        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// Get user's cart
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await CARTMODEL.findOne({ user: userId }).populate('items.product', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await CARTMODEL.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        // Remove item from cart
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            const itemTotal = item.quantity * product.price; // Assuming product has a price field
            return total + itemTotal;
        }, 0);

        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};