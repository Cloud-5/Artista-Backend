const db = require("../utils/database");

class SearchArtController {
  static async fetchAllArtworks() {
    try {
      const [rows] = await db.execute(`
        SELECT
          a.artwork_id,
          a.title AS artwork_name,
          a.price AS artwork_price,
          a.thumbnail_url AS artwork_image_url,
          a.published_date,
          CONCAT(u.fName, ' ', u.LName) AS artist_name,
          COUNT(al.artwork_id) AS total_likes,
          c.name AS category_name
        FROM
          artwork a
        INNER JOIN
          user u ON a.artist_id = u.user_id
        LEFT JOIN
          artwork_like al ON a.artwork_id = al.artwork_id
        LEFT JOIN
          category c ON a.category_id = c.category_id
        GROUP BY
          a.artwork_id;
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

exports.getAllArtworks = async (req, res, next) => {
  try {
    const artworks = await SearchArtController.fetchAllArtworks();
    res.status(200).json(artworks);
  } catch (error) {
    console.error("Error fetching all artworks:", error);
    res.status(500).json({ error: "Error fetching artworks" }); // Handle error response
  }
};

