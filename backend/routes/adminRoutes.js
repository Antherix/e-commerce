const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryCotroller');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Every admin route requires: valid JWT + role === 'admin'
router.use(auth, admin);

// Users
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUserById);
router.delete('/users/:id', userController.deleteUserById);
router.patch('/users/:id/activate', userController.activateUserById);
router.patch('/users/:id/deactivate', userController.deactivateUserById);

// Categories
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategoryById);
router.delete('/categories/:id', categoryController.deleteCategoryById);

// Orders (admin view)
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;