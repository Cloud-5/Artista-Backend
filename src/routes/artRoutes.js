const express = require('express');
const router = express.Router();
const artController = require('../controllers/artController');

router.get('/', artController.getArtwork);

module.exports = router;
