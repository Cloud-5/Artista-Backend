const db = require("../utils/database");

class notificationServices {
  static getAllNotifications = async (userId) => {
    const data = await db.query("SELECT * FROM notifications where receiver_id = ?", [userId]);
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
    console.log("notification in service", notification);
    const sql =
      "INSERT INTO notifications (notification_source, sender_id, receiver_id, title, body, isViewed, created_at) VALUES (?,?,?,?,?,?,NOW())";
    return db.execute(sql, [
      notification.source,
      notification.sender_id,
      notification.receiver_id,
      notification.title,
      notification.body,
      notification.isViewed,
    ]);
  };

  static updateNotification = async (notificationId) => {
    const sql =
      "UPDATE notifications SET isViewed=0 WHERE notification_id=?";
    return db.execute(sql, [
      notificationId,
    ]);
  };

  static deleteNotification = async (notificationId) => {
    const sql = "DELETE FROM notifications WHERE notification_id=?";
    return db.execute(sql, [notificationId]);
  };

  static readAll = async (userId) => {
    const sql = "UPDATE notifications SET isViewed=0 WHERE receiver_id=?";
    return db.execute(sql, [userId]);
  };

  static deleteAll = async (userId) => {
    const sql = "DELETE FROM notifications WHERE receiver_id=?";
    return db.execute(sql, [userId]);
  }
}

module.exports = notificationServices;