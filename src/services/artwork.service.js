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
    return db.execute(`SELECT 
    a.*, 
    COUNT(al.artwork_id) AS like_count
  FROM 
    artwork a
  LEFT JOIN 
    artwork_like al ON a.artwork_id = al.artwork_id
  WHERE 
    a.artist_id = ? AND 
    a.availability = 1
  GROUP BY 
    a.artwork_id;`,[artistId]);
  }

  static async getPurchasedCount(artworkId) {
    return db.execute(
      `SELECT 
    a.artwork_id,
    a.title,
    COALESCE(SUM(ci.quantity), 0) AS purchase_count
FROM 
    artwork a
LEFT JOIN 
    cart_item ci ON a.artwork_id = ci.artwork_id
WHERE 
    a.artwork_id = ?
GROUP BY 
    a.artwork_id, a.title;`,[artworkId]
    )
  }



  static async getLikesForArtwork(artworkId) {
    return db.execute(`SELECT COUNT(user_id) as count FROM artwork_like WHERE artwork_id = ?`,[artworkId]);
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
