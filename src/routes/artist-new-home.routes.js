const express = require('express');
const router = express.Router();
const artistNewHomeController = require('../controllers/artist-new-home.controller');



router.get('/:artistId', artistNewHomeController.getArtistData);
router.get('/get-available-Arts/:artistId',artistNewHomeController.getAvailableArtworkCount)

module.exports = router;