const express = require('express');
const router = express.Router();
const editArtwork = require('../controllers/edit-artwork.controller');

router.get('/:artwork_id', editArtwork.fetchArtwork);
router.put('/2d/:artwork_id',editArtwork.updateArtwork2D);
router.put('/3d/:artwork_id',editArtwork.updateArtwork3D);

module.exports = router;