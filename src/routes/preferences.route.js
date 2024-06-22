const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preference.controller');

router.get('/', preferencesController.showPreference);
router.post('/', preferencesController.addPreference);
router.get('/', preferencesController.checkPreferences);

module.exports = router;