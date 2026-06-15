const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const auth = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/createProduct',auth, productController.createProduct);

router.put('/:id',auth, productController.updateProductById);

router.delete('/:id',auth, productController.deleteProductById);


module.exports = router;