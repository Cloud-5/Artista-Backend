const db = require("../utils/database");

module.exports = class Artwork {
  static async getArtworks() {
    return db.execute("SELECT * FROM artwork");
  }

  static async getArtworkByArtistId(artistId) {
    return db.execute(`SELECT * FROM artwork WHERE artist_id = ${artistId}`);
  }

  static async getLikesForArtwork(artworkId) {
    return db.execute(`SELECT COUNT(user_id) as count FROM artwork_like WHERE artwork_id = ${artworkId}`);
  }
};
