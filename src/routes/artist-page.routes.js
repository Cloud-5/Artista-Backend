const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist-page.controller');

// GET all artists page
router.get('/', artistController.fetchAll);
router.get('/locations', artistController.fetchDistinctLocations);


module.exports=router;