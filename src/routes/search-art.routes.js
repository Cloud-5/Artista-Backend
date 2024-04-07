const express = require('express');
const router = express.Router();
const SearchArtController = require('../controllers/search-art.controller');

// Route to get all artworks
router.get('/', SearchArtController.getAllArtworks);

module.exports = router;
