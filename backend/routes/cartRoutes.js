const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.post('/add', auth, cartController.addToCart);
router.get('/:userId', auth, cartController.getCartByUserId);
router.delete('/remove', auth, cartController.removeFromCart);

module.exports = router;