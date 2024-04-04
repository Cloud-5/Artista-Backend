const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist-page.controller');

// GET all artists page
router.get('/', artistController.fetchAll);

module.exports = router;
