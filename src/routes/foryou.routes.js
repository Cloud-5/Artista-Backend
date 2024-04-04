const express = require('express');
const router = express.Router();
const forYouController = require('../controllers/foryou.controller');

router.get('/', forYouController.fetchAll);
module.exports = router;

