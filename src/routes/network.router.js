const express = require('express');
const router = express.Router();
const artistkNetworkController = require("../controllers/network.controller");

router.get('/followers/:id', artistkNetworkController.getFollowersForArtists);
router.get('/feedbacks/:id', artistkNetworkController.getFeedbacksForArtist);

module.exports = router;