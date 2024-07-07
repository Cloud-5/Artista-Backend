const express = require('express');
const router = express.Router();
const artistEdit = require('../controllers/artist-edit.controller');
const Artist = require('../models/artist-page.model')

// Route to update artist details
// router.put('/:artistId',artistEdit.updateArtist);

module.exports= router;