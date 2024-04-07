// const express = require('express');
// const router = express.Router();
// const artController = require('../controllers/artController');

// router.get('/:userId', artController.getArtwork);

// module.exports=router;


const express = require('express');
const router = express.Router();
const artController = require('../controllers/artController');

router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const gallery = await artController.fetchArtwork(userId);
    res.status(200).json(gallery);
  } catch (error) {
    console.error("Error fetching customer gallery:", error);
    next(error);
  }
});

module.exports = router;
