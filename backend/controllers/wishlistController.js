const WISHLISTMODEL = require('../models/wishlistModel');

// Add product to wishlist (create if doesn't exist)
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required' });
        }

        let wishlist = await WISHLISTMODEL.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new WISHLISTMODEL({ user: userId, products: [] });
        }

        // Avoid duplicates
        const alreadyAdded = wishlist.products.some(p => p.toString() === productId);
        if (alreadyAdded) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        await wishlist.populate('products', 'title price images');

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating wishlist', error: error.message });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishlist = await WISHLISTMODEL.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();

        await wishlist.populate('products', 'title price images');

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
    }
};

// Get logged-in user's wishlist
exports.getMyWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await WISHLISTMODEL
            .findOne({ user: userId })
            .populate('products', 'title price images averageRating');

        if (!wishlist) {
            return res.status(200).json({ products: [] });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};