const express = require('express');
const router = express.Router();
const ArtistPortfolioController = require('../controllers/artist-portfolio.controller');

router.get('/:artistId/:customerId', ArtistPortfolioController.getArtistDetails);
router.post('/:artistId/feedback', ArtistPortfolioController.postFeedback);
router.post('/:artistId/rating', ArtistPortfolioController.postRating);
router.post('/:artistId/follow', ArtistPortfolioController.followArtist);
router.post('/:artistId/unfollow', ArtistPortfolioController.unfollowArtist);

module.exports = router;

