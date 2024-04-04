const express = require('express');
const router = express.Router();
const artworkPreviewController = require('../controllers/artwork-preview.controller');

router.get('/:artId', artworkPreviewController.artworkPreview);
router.post('/:artId/like', artworkPreviewController.likeArtwork);
router.post('/:artistId/follow', artworkPreviewController.followArtist);

module.exports = router;