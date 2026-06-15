const REVIEWMODEL = require('../models/reviewModel');
const PRODUCTMODEL = require('../models/productModel');

// Create review (one per user per product)
exports.createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product, rating, comment } = req.body;

        const existing = await REVIEWMODEL.findOne({ user: userId, product });
        if (existing) {
            return res.status(400).json({ message: 'You already reviewed this product' });
        }

        const newReview = await REVIEWMODEL.create({ user: userId, product, rating, comment });

        // Update product averageRating and totalReviews
        const allReviews = await REVIEWMODEL.find({ product, status: 'active' });
        const totalReviews = allReviews.length;
        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        await PRODUCTMODEL.findByIdAndUpdate(product, {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews
        });

        res.status(201).json({ message: 'Review added', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

// Get all reviews (admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await REVIEWMODEL.find()
            .populate('user', 'name email')
            .populate('product', 'title');
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get reviews for a specific product (public)
exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await REVIEWMODEL
            .find({ product: req.params.productId, status: 'active' })
            .populate('user', 'name');
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get single review
exports.getReviewById = async (req, res) => {
    try {
        const review = await REVIEWMODEL.findById(req.params.id)
            .populate('user', 'name')
            .populate('product', 'title');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
};

// Update own review
exports.updateReviewById = async (req, res) => {
    try {
        const review = await REVIEWMODEL.findOne({ _id: req.params.id, user: req.user.id });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const { rating, comment } = req.body;
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        await review.save();

        // Recalculate product rating
        const allReviews = await REVIEWMODEL.find({ product: review.product, status: 'active' });
        const totalReviews = allReviews.length;
        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        await PRODUCTMODEL.findByIdAndUpdate(review.product, {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews
        });

        res.status(200).json({ message: 'Review updated', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

// Delete own review
exports.deleteReview = async (req, res) => {
    try {
        const review = await REVIEWMODEL.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Recalculate product rating after deletion
        const allReviews = await REVIEWMODEL.find({ product: review.product, status: 'active' });
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

        await PRODUCTMODEL.findByIdAndUpdate(review.product, {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews
        });

        res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};