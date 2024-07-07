const express = require('express');
const router = express.Router();
const artistNewHomeController = require('../controllers/artist-new-home.controller');



router.get('/:artistId', artistNewHomeController.getArtistData);

module.exports = router;