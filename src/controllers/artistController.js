const db = require('../utils/database');

class Artist {
  static fetchAll() {
    return db.execute(`
      SELECT 
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
      GROUP BY 
        a.artwork_id
    `);
  }
};



exports.fetchAll = async (req, res, next) => {
    try {
        const artist = await Artist.fetchAll();

        res.status(200).json(artist[0]);
    } catch (error) {
        next(error);
}
}




