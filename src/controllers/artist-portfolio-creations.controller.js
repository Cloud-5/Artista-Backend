const db = require("../utils/database");

class ArtistCreationsGallery {
  static fetchCreations(artistId) {
    return db.execute(
      `
        SELECT 
        a.artwork_id,
        a.title AS artwork_name,
        a.price AS artwork_price,
        a.thumbnail_url AS artwork_image_url,
        COUNT(al.artwork_id) AS total_likes,
        CONCAT(u.fName, ' ', u.LName) AS artist_name
    FROM 
        artwork a
    INNER JOIN 
        user u ON a.artist_id = u.user_id
    LEFT JOIN 
        artwork_like al ON a.artwork_id = al.artwork_id
    WHERE 
        a.artist_id = ?
    GROUP BY 
        a.artwork_id;
      `,
      [artistId]
    );
  }
}

exports.getArtistCreationsGallery = async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const creations = await ArtistCreationsGallery.fetchCreations(artistId);
    res.status(200).json(creations[0]);
  } catch (error) {
    console.error("Error fetching artist creations gallery:", error);
    next(error);
  }
};
