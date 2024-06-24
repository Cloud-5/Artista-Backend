const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authentication');
const { checkRole } = require('../middlewares/checkRole');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgotPasword', userController.forgotPasword);
router.post('/resetPassword', userController.resetPassword);
router.post('/changePassword', auth.authenticateToken, userController.changePassword);
// router.get('/hasPreferences/:user_id', userController.hasPreferences);



// Example route for artist only
router.get('/artistOnly', auth.authenticateToken, checkRole(process.env.ARTIST), (req, res) => {
    res.send('Artist access granted');
});

// Example route for customer only
router.get('/customerOnly', auth.authenticateToken, checkRole(process.env.CUSTOMER), (req, res) => {
    res.send('Customer access granted');
});
module.exports = router;
