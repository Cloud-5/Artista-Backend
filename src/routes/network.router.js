const express = require('express');
const router = express.Router();
const artistNetworkController = require("../controllers/network.controller");

// router.get('/followers/:id', artistkNetworkController.getFollowersForArtists);
// router.get('/feedbacks/:id', artistkNetworkController.getFeedbacksForArtist);
// router.delete('/delete-follower', artistkNetworkController.deleteFollower);




router.get('/followers/:id', artistNetworkController.getFollowersForArtists);
router.get('/feedbacks/:id', artistNetworkController.getFeedbacksForArtist);
router.delete('/delete-follower', artistNetworkController.deleteFollower);

module.exports = router;