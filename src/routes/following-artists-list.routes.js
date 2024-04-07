const express = require('express');
const router = express.Router();
const FollowingArtistsList = require('../controllers/following-artists-list.controller');

// Route to get followed artists list
router.get('/:userId', FollowingArtistsList.getFollowedArtistsList);

// Route to remove followed artist
router.delete('/:userId/:artistId', FollowingArtistsList.removeFollowedArtist);

module.exports = router;
