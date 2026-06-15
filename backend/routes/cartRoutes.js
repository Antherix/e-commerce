const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/addToCart', cartController.addToCart);
router.get('/cart/:userId', cartController.getCartByUserId);
router.delete('/cart/:id', cartController.removeFromCart);
module.exports = router;