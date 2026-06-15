const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', auth, reviewController.updateReviewById);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;