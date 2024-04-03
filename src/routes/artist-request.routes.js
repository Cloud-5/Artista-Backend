const express = require('express');
const router = express.Router();
const userController = require('../controllers/artist-request.controller');

router.get('/', userController.getRequestedArtists);
router.get('/artist-details/:userId', userController.getArtistDetails);
router.put('/approve-artist/:userId', userController.approveArtist);

module.exports = router;

 