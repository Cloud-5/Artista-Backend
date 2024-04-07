const express = require('express');
const router = express.Router();
const artworkController = require("../controllers/artwork.controller");

router.get('/all', artworkController.getAllArtworks);
router.get('/all/:id', artworkController.getArtworksForArtist);
router.get('/likes/:id', artworkController.getLikesForArtwork);

module.exports = router;