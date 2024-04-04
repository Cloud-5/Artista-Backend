const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Update the route to handle POST requests with the required parameters
router.post('/:user_id', (req, res, next) => {
    const { user_id, pNumber, location, description, paymentMethod, cartItems } = req.body;

    // Pass the parameters to the createPurchase function in the controller
    cartController.createPurchase(req, res, next, user_id, pNumber, location, description, paymentMethod, cartItems);
});

module.exports = router;
