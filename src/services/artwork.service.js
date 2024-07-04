const db = require("../utils/database");

module.exports = class Artwork {
  static async postArtwork(artwork) {
    return db.execute(
      "INSERT INTO artwork (artist_id, title, description, price, thumbnail_url, category_id) VALUES (?,?,?,?)",
      [
        artwork.artist_id,
        artwork.title,
        artwork.description,
        artwork.price,
        artwork.thumbnail_url,
        artwork.category_id,
      ]
    );
  }

  static async getArtworks() {
    return db.execute("SELECT * FROM artwork");
  }

  static async getArtworkByArtistId(artistId) {
    return db.execute(`SELECT * FROM artwork WHERE artist_id = ?`, [artistId]);
  }

  static async getLikesForArtwork(artworkId) {
    return db.execute(
      "SELECT COUNT(user_id) as count FROM artwork_like WHERE artwork_id = ?",
      [artworkId]
    );
  }

  static async getArtworkById(artworkId) {
    return db.execute(`SELECT * FROM artwork WHERE artwork_id = ?`, [
      artworkId,
    ]);
  }

  static async deleteArtwork(artworkId) {
    return db.execute(`DELETE FROM artwork WHERE artwork_id = ?`, [artworkId]);
  }

  static async updateArtwork(artworkId, artwork) {
    return db.execute(
      `UPDATE artwork SET title = ?, description = ?, price = ? WHERE artwork_id = ?`,
      [artwork.title, artwork.description, artwork.price, artworkId]
    );
  }



  async addArtworkByArtist(artwork) {
    const { artist_id, title, price, thumbnail_url, description, published_date, category_id } = artwork;
    const [result] = await db.query(
      'INSERT INTO artwork (artist_id, title, price, thumbnail_url, description, published_date, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [artist_id, title, price, thumbnail_url, description, published_date, category_id]
    );
    return result.insertId;
  }


  async addArtworkByArtist(artwork) {
    const { artist_id, title, price, thumbnail_url, description, published_date, category_id, tags } = artwork;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO artwork (artist_id, title, price, thumbnail_url, description, published_date, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [artist_id, title, price, thumbnail_url, description, published_date, category_id]
      );

      const artworkId = result.insertId;

      if (tags && tags.length > 0) {
        const tagInserts = tags.map(tag => [artworkId, tag]);
        await connection.query(
          'INSERT INTO artwork_tag (artwork_id, tag_name) VALUES ?',
          [tagInserts]
        );
      }

      await connection.commit();
      return artworkId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};
