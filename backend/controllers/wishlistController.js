const WISHLISTMODEL = require('../models/wishlistModel');

// Create a new wishlist
exports.createWishlist = async (req, res) => {
    try {
        const { user, products } = req.body;
        const newWishlist = new WISHLISTMODEL({ user, products });

        await newWishlist.save();

        res.status(201).json({ message: 'Wishlist created successfully', wishlist: newWishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating wishlist', error: error.message });
    }
};

// Get all wishlists
exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await WISHLISTMODEL.find().populate('user').populate('products');
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlists', error: error.message });
    }
};

// Get a wishlist by ID
exports.getWishlistById = async (req, res) => {
    try {
        const wishlist = await WISHLISTMODEL.findById(req.params.id).populate('user').populate('products');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};

// Update a wishlist by ID
exports.updateWishlistById = async (req, res) => {
    try {
        const updatedWishlist = await WISHLISTMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user').populate('products');
        if (!updatedWishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json({ message: 'Wishlist updated successfully', wishlist: updatedWishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating wishlist', error: error.message });
    }   
};

// Delete a wishlist by ID
exports.deleteWishlistById = async (req, res) => {
    try {
        const deletedWishlist = await WISHLISTMODEL.findByIdAndDelete(req.params.id);
        if (!deletedWishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json({ message: 'Wishlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting wishlist', error: error.message });
    }
};
