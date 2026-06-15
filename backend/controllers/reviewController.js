const REVIEWMODEL = require('../models/reviewModel');

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { user, product, rating, comment } = req.body;
        const newReview = new REVIEWMODEL({ user, product, rating, comment });

        await newReview.save();

        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await REVIEWMODEL.find().populate('user').populate('product');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await REVIEWMODEL.findById(req.params.id).populate('user').populate('product');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
};

// Update a review by ID
exports.updateReviewById = async (req, res) => {
    try {
        const updatedReview = await REVIEWMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user').populate('product');
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    }   catch (error) {     
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};
    