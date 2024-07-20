const express = require('express');
const router = express.Router();
const creation = require('../controllers/creation.controller');

router.put('/delete-artwork', creation.deleteArtwork);

module.exports = router;