const express = require('express');
const router = express.Router();
const artistUploadArtworks = require('../controllers/artist-upload-artwork.controller');

router.get('/', artistUploadArtworks.fetchAll);


module.exports = router;
