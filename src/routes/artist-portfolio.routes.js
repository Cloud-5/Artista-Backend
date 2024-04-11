const express = require('express');
const router = express.Router();
const ArtistPortfolioController = require('../controllers/artist-portfolio.controller');

router.get('/:artistId', ArtistPortfolioController.getArtistDetails);
router.post('/:artistId', ArtistPortfolioController.postFeedback)

module.exports = router;
