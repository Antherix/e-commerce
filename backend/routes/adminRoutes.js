const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryCotroller');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// All admin routes require both auth + admin role
router.use(auth, admin);

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUserById);
router.delete('/users/:id', userController.deleteUserById);
router.patch('/users/:id/activate', userController.activateUserById);
router.patch('/users/:id/deactivate', userController.deactivateUserById);

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategoryById);
router.delete('/categories/:id', categoryController.deleteCategoryById);

module.exports = router;