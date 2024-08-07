const db = require("../utils/database");

class CustomerGalleryArt {
  static fetchGallery(userId) {
    return db.execute(
      `
        SELECT 
        g.customer_user_id AS customer_id,
        a.artwork_id,
        a.title AS artwork_name,
        a.price AS artwork_price,
        a.thumbnail_url AS artwork_image_url,
        COUNT(al.artwork_id) AS total_likes,
        CONCAT(u.fName, ' ', u.LName) AS artist_name
    FROM 
        gallery g
    INNER JOIN 
        artwork a ON g.artwork_id = a.artwork_id
    INNER JOIN 
        user u ON a.artist_id = u.user_id
    LEFT JOIN 
        artwork_like al ON a.artwork_id = al.artwork_id
    WHERE 
        g.customer_user_id = ?
    GROUP BY 
        g.customer_user_id, a.artwork_id;
        `,
      [userId]
    );
  }
}

exports.getCustomerGallery = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const gallery = await CustomerGalleryArt.fetchGallery(userId);
    res.status(200).json(gallery[0]);
  } catch (error) {
    console.error("Error fetching customer gallery:", error);
    next(error);
  }
};