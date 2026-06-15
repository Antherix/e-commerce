const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/authMiddleware');

// All address routes require login
router.post('/', auth, addressController.createAddress);
router.get('/', auth, addressController.getAllAddresses);
router.get('/:id', auth, addressController.getAddressById);
router.put('/:id', auth, addressController.updateAddressById);
router.delete('/:id', auth, addressController.deleteAddressById);

module.exports = router;