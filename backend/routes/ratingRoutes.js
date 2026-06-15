const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

router.post('/createReview', reviewController.createReview);


router.get('/reviews', reviewController.getAllReviews);

router.get('/reviews/:id', reviewController.getReviewById);

router.put('/reviews/:id', reviewController.updateReviewById);


module.exports = router;
