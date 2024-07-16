const express = require('express');
const router = express.Router();
const artCardController = require('../controllers/art-card.controller'); // Adjust the path as necessary

router.delete('/remove-gallery-item/:customer_user_id/:artwork_id', artCardController.removeGalleryItem);

module.exports = router;
