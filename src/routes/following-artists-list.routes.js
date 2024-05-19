const express = require('express');
const router = express.Router();
const FollowingArtistsListController = require('../controllers/following-artists-list.controller');

// Route to get followed artists list
router.get('/:userId', FollowingArtistsListController.getFollowedArtistsList);

router.post('/:artistId/unfollow', FollowingArtistsListController.unfollowArtist);

module.exports = router;