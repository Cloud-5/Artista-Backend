const express = require('express');
const router = express.Router();
const ArtistCreationsGallery = require('../controllers/artist-portfolio-creations.controller');

router.get('/:artistId', ArtistCreationsGallery.getArtistCreationsGallery);

module.exports = router;
