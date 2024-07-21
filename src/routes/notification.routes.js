
const express = require('express');
const router = express.Router();
const notificatioController = require('../controllers/notification.controller');

//router.post('/send-notification', notificatioController.sendNotification);
router.post('/create-notification', notificatioController.createNotification);
router.get('/:userId', notificatioController.getNotifications);
// router.get('/notifications/:id', notificatioController.getNotificationsByArtistId);
// router.get('/notifications/customer/:id', notificatioController.getNotificationsByCustomerId);
// router.get('/notifications/:id', notificatioController.getNotificationById);
router.put('/read', notificatioController.updateNotification); //send id in body
router.put('/read-all', notificatioController.readAllNotifications);
router.delete('/delete-all', notificatioController.deleteAllNotifications);
router.delete('/notifications/:id', notificatioController.deleteNotification);

module.exports = router;