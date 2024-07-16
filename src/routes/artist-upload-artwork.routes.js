const express = require('express');
const router = express.Router();
const artistUploadArtworks = require('../controllers/artist-upload-artwork.controller');

router.get('/', artistUploadArtworks.fetchAll);
router.post('/2d', artistUploadArtworks.upload2DArtwork);
router.post('/3d', artistUploadArtworks.upload3DArtwork);


module.exports = router;
