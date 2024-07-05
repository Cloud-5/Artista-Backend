const db = require('../utils/database');

class Foryou {
  static async fetchAll(userId, page = 1, pageSize = 20) {
    try {
      // Calculate total count of artworks matching user's preferences
      const totalCountQuery = `
        SELECT COUNT(DISTINCT a.artwork_id) AS total
        FROM artwork a
        INNER JOIN user u ON a.artist_id = u.user_id
        LEFT JOIN artwork_like al ON a.artwork_id = al.artwork_id
        WHERE a.category_id IN (
          SELECT category_id
          FROM preferences
          WHERE user_id = ${userId}
        )
      `;
      const [totalCountRows] = await db.execute(totalCountQuery);
      const totalItems = totalCountRows[0].total;

      // Calculate offset based on current page and page size
      const offset = (page - 1) * pageSize;

      // Fetch paginated artworks with trending score
      const fetchQuery = `
        SELECT 
          a.artwork_id,
          a.title AS artwork_title,
          a.price,
          COUNT(al.artwork_id) AS total_likes,
          CONCAT(u.fName, ' ', u.LName) AS artist_name,
          a.thumbnail_url,
          COALESCE(SUM(CASE WHEN al.liked_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END), 0) AS trending_score
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
        ORDER BY trending_score DESC, a.artwork_id
        LIMIT ${pageSize} OFFSET ${offset};
      `;
      
      const [artworkRows] = await db.execute(fetchQuery);
      return { artworks: artworkRows, totalItems };
    } catch (error) {
      throw error;
    }
  }
}

exports.fetchAll = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 20;

    const foryouData = await Foryou.fetchAll(userId, page, pageSize);

    res.status(200).json({
      artworks: foryouData.artworks,
      totalItems: foryouData.totalItems,
      currentPage: page,
      pageSize: pageSize
    });
  } catch (error) {
    next(error);
  }
};
