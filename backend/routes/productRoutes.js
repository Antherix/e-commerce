const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const auth = require('../middleware/authMiddleware');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

router.post('/createProduct',auth, productController.createProduct);
router.put('/products/:id',auth, productController.updateProductById);
router.delete('/products/:id',auth, productController.deleteProductById);


module.exports = router;