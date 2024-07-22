const express = require('express');
const router = express.Router();
const helpCenter = require('../controllers/help-center.controller');

router.post('/complaints', helpCenter.submitComplaint);
router.get('/categories', helpCenter.getCategories);

module.exports = router;