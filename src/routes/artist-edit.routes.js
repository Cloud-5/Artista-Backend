const express = require('express');
const router = express.Router();
const artistEdit = require('../controllers/artist-edit.controller');
const Artist = require('../models/artist-page.model')

// Route to update artist details
router.put('/:artistId',artistEdit.updateArtist);




// router.post('/:artistId/social-media', artistEdit.addSocialMediaLink);
router.put('/social-media/:artistId', artistEdit.updateSocialMediaLink);
// router.get('/:userId', artistEdit.getFollowers);
router.get('/social-media-platforms',artistEdit.getSocialMediaPlatforms);
router.get('/social-accounts/:artistId',artistEdit.getSocialAccounts);
router.put('/artwork-availability/', artistEdit.updateArtworkAvailability);
module.exports= router;