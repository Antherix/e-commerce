const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/createProduct', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProductById);
router.delete('/products/:id', productController.deleteProductById);


module.exports = router;