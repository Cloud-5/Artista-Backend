const db = require("../utils/database");

module.exports = class ArtistNetwork {
  static async getFollowers(artistId) {
    return db.execute(
      `SELECT user.* FROM user, artist_follower WHERE user.user_id = follower_user_id AND followed_artist_user_id = ${artistId}`
    );
  }

  static async getFeedbacksForArtist(artistId) {
    return db.execute(
      `SELECT f.*, u.* FROM feedback f, user u WHERE f.customer_user_id = u.user_id AND f.artist_user_id = ${artistId}`
    );
  }

  static async deleteFollower(followerId, artistId) {
    return db.execute(
      `DELETE FROM artist_follower WHERE follower_user_id = ${followerId} AND followed_artist_user_id = ${artistId}`
    );
  }
};

class ArtistNetwork {
  static async getFollowers(artistId) {
    try {
      const [rows, fields] = await db.execute(
        'SELECT u.user_id, u.username, u.email, u.profile_photo_url, u.location ' +
        'FROM user u ' +
        'INNER JOIN artist_follower af ON u.user_id = af.follower_user_id ' +
        'WHERE af.followed_artist_user_id = ?',
        [artistId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }
  

  static async getFeedbacksForArtist(artistId) {
    try {
      const [rows, fields] = await db.execute(
        'SELECT * FROM feedback WHERE artist_id = ?',
        [artistId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  }


  static async deleteFollower(followerId, artistId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM artist_follower WHERE follower_user_id = ? AND followed_artist_user_id = ?',
        [followerId, artistId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting follower:', error);
      throw error;
    }
  }



}

module.exports = ArtistNetwork;
