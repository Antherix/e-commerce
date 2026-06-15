const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/authMiddleware');

// All wishlist routes require login
router.post('/add', auth, wishlistController.addToWishlist);
router.delete('/remove', auth, wishlistController.removeFromWishlist);
router.get('/my', auth, wishlistController.getMyWishlist);

module.exports = router;