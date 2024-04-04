const db = require('../utils/database');

class Foryou {
  static fetchAll(userId) {
    return db.execute(`
    SELECT 
      a.artwork_id,
      a.title AS artwork_title,
      a.price,
      COUNT(al.artwork_id) AS total_likes,
      CONCAT(u.fName, ' ', u.LName) AS artist_name,
      a.thumbnail_url
    FROM 
      artwork a
    INNER JOIN 
      user u ON a.artist_id = u.user_id
    LEFT JOIN 
      artwork_like al ON a.artwork_id = al.artwork_id
    WHERE
      a.category_id IN (
        SELECT category_id
        FROM preferences
        WHERE user_id = ${userId}
      )
    GROUP BY 
      a.artwork_id;
    `);
  }
}

exports.fetchAll = async (req, res, next) => {
  try {
    const user_id = req.params.user_id; // Assuming user ID is passed in the request parameters
    const foryou = await Foryou.fetchAll(user_id);

    res.status(200).json(foryou[0]);
  } catch (error) {
    next(error);
  }
}
