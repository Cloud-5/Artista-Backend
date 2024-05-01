const express = require('express');
const router = express.Router();
const PurchaseHistoryController = require('../controllers/purchase-history.controller');

router.get('/:userId', PurchaseHistoryController.getPurchaseHistory);
router.delete('/:purchaseId', PurchaseHistoryController.deletePurchase)

module.exports = router;
