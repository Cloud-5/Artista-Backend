const express = require('express');
const router = express.Router();
const CustomerGalleryArt = require('../controllers/customer-gallery-arts.controller');

router.get('/:userId', CustomerGalleryArt.getCustomerGallery);

module.exports = router;
