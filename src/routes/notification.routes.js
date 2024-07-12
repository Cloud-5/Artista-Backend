
const express = require('express');
const router = express.Router();
const notificatioController = require('../controllers/notification.controller');

router.post('/send-notification', notificatioController.sendNotification);
router.post('/create-notification', notificatioController.createNotification);
router.get('/notifications', notificatioController.getNotifications);
router.get('/notifications/artist/:id', notificatioController.getNotificationsByArtistId);
router.get('/notifications/customer/:id', notificatioController.getNotificationsByCustomerId);
router.get('/notifications/:id', notificatioController.getNotificationById);
router.put('/notifications/:id', notificatioController.updateNotification);
router.delete('/notifications/:id', notificatioController.deleteNotification);

module.exports = router;