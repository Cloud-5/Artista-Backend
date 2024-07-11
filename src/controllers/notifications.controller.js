const admin = require("firebase-admin");

const sendNotification = async (req, res, next) => {
  const { messageTitle, messageBody } = req.body;

  // Construct a notification message
  const message = {
    notification: {
      title: messageTitle,
      body: messageBody,
    },
    topic: "allDevices", // Replace with your topic or token
  };

  // Send the notification
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Notification sent successfully:", response);
      res.status(200).json({ message: "Notification sent successfully" });
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Error sending notification" });
    });
};

module.exports = { sendNotification };
