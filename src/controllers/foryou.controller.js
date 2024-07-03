const db = require('../utils/database');

class Foryou {
  static fetchAll(userId, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
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
        a.artwork_id
      LIMIT ${pageSize} OFFSET ${offset};
    `);
  }
}

exports.fetchAll = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 20;
    const foryou = await Foryou.fetchAll(userId, page, pageSize);

    res.status(200).json(foryou[0]);
  } catch (error) {
    next(error);
  }
};
