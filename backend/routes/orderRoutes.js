const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// User routes
router.post('/', auth, orderController.createOrder);
router.get('/my', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.patch('/:id/cancel', auth, orderController.cancelOrder);

module.exports = router;