const express = require('express');
const router = express.Router();
const personalizeController = require('../controllers/personalize.controller');

router.get('/:user_id', personalizeController.showUserPreferences);
router.put('/:user_id', personalizeController.updatePreferences);

module.exports = router;
