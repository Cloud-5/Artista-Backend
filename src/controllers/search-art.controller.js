const db = require("../utils/database");

exports.searchArtworks = async (req, res, next) => {
  const searchTerm = req.params.term;
  const selectedCategories = req.query.categories; // Get selected category IDs

  let categoryFilter = "";
  if (selectedCategories && selectedCategories.length > 0) {
    categoryFilter = `AND a.category_id IN (${selectedCategories.join(",")})`;
  }

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
        c.name AS category_name,
        a.category_id
      FROM
        artwork a
      INNER JOIN
        user u ON a.artist_id = u.user_id
      LEFT JOIN
        artwork_like al ON a.artwork_id = al.artwork_id
      LEFT JOIN
        category c ON a.category_id = c.category_id
      WHERE
        a.title LIKE ?
        ${categoryFilter}
      GROUP BY
        a.artwork_id;
    `, [`%${searchTerm}%`]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching artworks:", error);
    res.status(500).json({ error: "Error searching artworks" });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
      SELECT category_id, name
      FROM category;
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

