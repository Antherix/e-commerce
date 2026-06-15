const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const { registerRules, loginRules, checkErrors } = require('../middleware/validate');

router.post('/register', registerRules, checkErrors, userController.createUser);
router.post('/login', loginRules, checkErrors, userController.loginUser);
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);

router.put('/change-password', auth, userController.changePassword);





module.exports = router;