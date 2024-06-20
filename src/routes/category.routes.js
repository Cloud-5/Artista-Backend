const express = require('express');
const router = express.Router();
const categorycontroller = require('../controllers/category.controller');

router.get('/',categorycontroller.fetchAll);
module.exports = router;
