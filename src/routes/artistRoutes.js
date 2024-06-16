const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.get('/', artistController.fetchAll);
router.get('/trending', artistController.fetchTrending);
module.exports=router;