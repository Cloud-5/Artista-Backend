const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preference.controller');

router.get('/', preferencesController.showPreference);

module.exports = router;