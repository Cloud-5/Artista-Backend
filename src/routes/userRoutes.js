const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgotPasword', userController.forgotPasword);
router.post('/resetPassword', userController.resetPassword);

// router.get('/hasPreferences/:user_id', userController.hasPreferences);
module.exports = router;
