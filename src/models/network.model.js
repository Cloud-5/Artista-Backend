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
};
