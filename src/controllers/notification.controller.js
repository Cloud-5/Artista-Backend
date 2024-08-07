// const admin = require("firebase-admin");
const notificationServices = require('../services/notification.service')

// const sendNotification = async (req, res, next) => {
//   const { messageTitle, messageBody } = req.body;

//   // Construct a notification message
//   const message = {
//     notification: {
//       title: messageTitle,
//       body: messageBody,
//     },
//     topic: "allDevices", // Replace with your topic or token
//   };

//   // Send the notification
//   admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       console.log("Notification sent successfully:", response);
//       res.status(200).json({ message: "Notification sent successfully" });
//     })
//     .catch((error) => {
//       console.error("Error sending notification:", error);
//       res.status(500).json({ error: "Error sending notification" });
//     });
// };

const createNotification = async (req, res, next) => {
  const { sender_id, receiver_id, source, title, body, isViewed } = req.body;
  console.log("req.body", req.body);

  try {
    const notification = {
      source : req.body.notification.source,
      sender_id: req.body.notification.sender_id,
      receiver_id: req.body.notification.receiver_id,
      title: req.body.notification.title,
      body: req.body.notification.body,
      isViewed: req.body.notification.isViewed,
    };

    const result = await notificationServices.createNotification(notification);
    res.status(200).json({
      message: "Notification created successfully",
      notification: result,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Error creating notification" });
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("userId for noti", userId);
    const notifications = await notificationServices.getAllNotifications(userId);
    console.log("notifications", notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

// const getNotificationsByArtistId = async (req, res, next) => {
//   const artistId = req.params.id;

//   console.log("artistId", artistId);

//   try {
//     const notifications = await notificationServices.getNotificationsByArtistId(
//       artistId
//     );
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ error: "Error fetching notifications" });
//   }
// };

// const getNotificationsByCustomerId = async (req, res, next) => {
//   const customerId = req.params.id;

//   console.log("customerId", customerId);    

//   try {
//     const notifications =
//       await notificationServices.getNotificationsByCustomerId(customerId);
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ error: "Error fetching notifications" });
//   }
// };

// const getNotificationById = async (req, res, next) => {
//   const notificationId = req.params.id;

//   console.log("notificationId", notificationId);

//   try {
//     const [notification] = await notificationServices.getNotificationById(
//       notificationId
//     );
//     if (notification.length === 0) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     res.status(200).json(notification[0]);
//   } catch (error) {
//     next(error);
//   }
// };

const updateNotification = async (req, res, next) => {
  const notificationId = req.body.id;

  try {
    const result = await notificationServices.updateNotification(notificationId);
    res.status(200).json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Error updating notification" });
  }
};

const deleteNotification = async (req, res, next) => {
  const notificationId = req.params.id;

  try {
    const result = await notificationServices.deleteNotification(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Error deleting notification" });
  }
};

const readAllNotifications = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const result = await notificationServices.readAll(userId);
    res.status(200).json({ message: "All notifications read successfully" });
  } catch (error) {
    console.error("Error reading all notifications:", error);
    res.status(500).json({ error: "Error reading all notifications" });
  }

}

const deleteAllNotifications = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const result = await notificationServices.deleteAll(userId);
    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({ error: "Error deleting all notifications" });
  }
}

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  readAllNotifications,
  deleteAllNotifications
};
