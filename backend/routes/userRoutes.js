const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


const auth = require('../middleware/authMiddleware');

router.get('/profile', auth, userController.getUserProfile);

router.put('/profile', auth, userController.updateUserProfile);

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);//







module.exports = router;