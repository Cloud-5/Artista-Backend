const db = require("../utils/database");

class Art {
  static fetchArtwork() {
    return db.execute(
    ` SELECT 
    a.artwork_id,
    a.title AS artwork_name,
    a.price AS artwork_price,
    CONCAT(u.fName, ' ', u.LName) AS artist_name,
    a.thumbnail_url AS artwork_image_url,
    COUNT(al.artwork_id) AS total_likes,
    MIN(al.liked_at) AS first_like_time,
    MAX(al.liked_at) AS last_like_time,
    TIMESTAMPDIFF(SECOND, MIN(al.liked_at), MAX(al.liked_at)) AS like_time_span
FROM 
    artwork a
JOIN 
    artwork_like al ON a.artwork_id = al.artwork_id
JOIN 
    user u ON a.artist_id = u.user_id
WHERE 
    al.liked_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
GROUP BY 
    a.artwork_id, artwork_name, artist_name, artwork_price, a.thumbnail_url
ORDER BY 
    total_likes DESC,
    like_time_span ASC
LIMIT 20;

        `,
    
    );
  }
  
}

exports.getArtwork = async (req, res, next) => {
  
  try {
    const gallery = await Art.fetchArtwork();
    res.status(200).json(gallery[0]);
  } catch (error) {
    console.error("Error fetching customer gallery:", error);
    next(error);
}
};