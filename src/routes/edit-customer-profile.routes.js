const express = require('express');
const router = express.Router();
const editCustomerProfileController = require('../controllers/edit-customer-profile.controller');

router.put('/:userId', editCustomerProfileController.updateCustomerProfile);

module.exports = router;
