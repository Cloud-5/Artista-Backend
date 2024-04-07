const express = require('express');
const router = express.Router();
const CustomerProfileGallery = require('../controllers/customer-profile-gallery.controller');

router.get('/:userId', CustomerProfileGallery.getAllCustomers);

module.exports = router;