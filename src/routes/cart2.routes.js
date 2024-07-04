// routes/cart.routes.js
const express = require('express');

const router = express.Router();
const cart2Controller = require('../controllers/cart2.controller');

router.post('/add', cart2Controller.addItem);
router.delete('/remove', cart2Controller.removeItem);
router.get('/:userId', cart2Controller.getCartItems);
router.delete('/clear', cart2Controller.clearCart);

router.post('/increment', cart2Controller.incrementQuantity);
router.post('/decrement', cart2Controller.decrementQuantity);

module.exports = router;
