const express = require('express');
const router = express.Router();
const notificatioController = require('../controllers/notifications.controller');

router.post('/send-notification', notificatioController.sendNotification);

module.exports = router;