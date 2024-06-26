// // dhanushka

// const express = require('express');
// const router = express.Router();
// const {getArtistFollowers}=require('../controllers/artist-followers.controller');

// // define route to get followers of an artist by artist's ID
// router.get('/:artistId/followers',getArtistFollowers);

// module.exports=router;


const express = require('express');
const router = express.Router();
const { getArtistFollowers } = require('../controllers/artist-followers.controller');

// Define route to get followers of an artist by artist's ID
router.get('/:artistId/followers', getArtistFollowers);

module.exports = router;
