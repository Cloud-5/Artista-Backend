const express = require('express');
const router = express.Router();
const SearchArtController = require('../controllers/search-art.controller');

router.get('/search/:term', SearchArtController.searchArtworks);
router.get('/searchCategory/:categoryId',SearchArtController.getArtByCatId)
router.get('/', SearchArtController.getCategories);

module.exports = router;
