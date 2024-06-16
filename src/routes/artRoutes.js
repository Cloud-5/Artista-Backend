const express = require('express');
const router = express.Router();
const artController = require('../controllers/artController');

router.get('/', artController.getArtwork);
// GET trending artworks for a given duration
router.get('/trending/:durationInDays', async (req, res, next) => {
    const { durationInDays } = req.params;
    try {
      const trendingArtworks = await artController.fetchArtworkTrending(durationInDays);
      res.status(200).json(trendingArtworks[0]);
    } catch (error) {
      console.error("Error fetching trending artworks:", error);
      next(error);
    }
  });




module.exports = router;
