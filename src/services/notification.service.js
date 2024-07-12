const db = require("../utils/database");

class notificationServices {
  static getAllNotifications = async () => {
    const data = await db.query("SELECT * FROM notifications");
    return data[0];
  };

  static getNotificationsByArtistId = async (artistId) => {
    const data  = await db.query(`SELECT * FROM notifications WHERE receiver_id=? AND notification_source='customer'`, [artistId]);
    return data[0];
  };

  static getNotificationsByCustomerId = async (customerId) => {
    const data = await db.query("SELECT * FROM notifications WHERE receiver_id=? AND notification_source='artist'", [customerId]);
    return data[0];
  };

  static getNotificationById = async (notificationId) => {
    const data = await db.query("SELECT * FROM notifications WHERE notification_id=?", [notificationId]);
    return data;
  };

  static createNotification = async (notification) => {
    const sql =
      "INSERT INTO notifications (notification_source, sender_id, receiver_id, title, body, image, isViewed) VALUES (?,?,?,?,?,?,?)";
    return db.execute(sql, [
      notification.source,
      notification.sender_id,
      notification.receiver_id,
      notification.title,
      notification.body,
      notification.image,
      notification.isViewed,
    ]);
  };

  static updateNotification = async (notificationId, notification) => {
    const sql =
      "UPDATE notifications SET title=?, body=?, image=?, isViewed=? WHERE notification_id=?";
    return db.execute(sql, [
      notification.title,
      notification.body,
      notification.image,
      notification.isViewed,
      notificationId,
    ]);
  };

  static deleteNotification = async (notificationId) => {
    const sql = "DELETE FROM notifications WHERE notification_id=?";
    return db.execute(sql, [notificationId]);
  };
}

module.exports = notificationServices;
