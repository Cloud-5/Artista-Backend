const express = require('express');
const router = express.Router();
const forYouController = require('../controllers/foryou.controller');

// Assuming the user ID is passed as a parameter in the URL
router.get('/:user_id', forYouController.fetchAll);

module.exports = router;
