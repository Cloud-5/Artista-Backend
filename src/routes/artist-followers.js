


const express = require('express');
const router = express.Router();
const { getArtistFollowers } = require('../controllers/artist-followers.controller');
const { deleteFollower } = require('../models/network.model');

router.get('/:artistId/followers', getArtistFollowers);
router.delete('/:artistId/delete-followers/:followwerId',deleteFollower);


module.exports = router;
