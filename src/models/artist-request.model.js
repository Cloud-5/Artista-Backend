const db = require('../utils/database');

module.exports = class artistRequest {
  static getRequestedArtists() {
    return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "artist" AND is_approved = FALSE');
  }

  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }

  static approveArtist(userId) {
    return db.execute('UPDATE user SET is_approved = TRUE WHERE user_id = ?', [userId]);
  }

  static rejectArtist(userId) {
    return db.execute('DELETE FROM user WHERE user_id = ?', [userId]);
  }
}
