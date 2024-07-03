
const db = require('../utils/database');

class Artist {
    static fetchAll() {
        return db.execute(`
            SELECT 
 af.followed_artist_user_id, 
CONCAT(u.fName, ' ', u.LName) AS artist_name,
 COUNT(follower_user_id) AS total_followers,
 u.profession  AS  artist_profession,
 MIN(follow_date) AS first_follow_date,
 MAX(follow_date) AS last_follow_date,
 DATEDIFF( MAX(follow_date), MIN(follow_date)) AS days_to_reach
  FROM 
        artist_follower af

JOIN
user u ON af.followed_artist_user_id = u.user_id
 GROUP BY 
        af.followed_artist_user_id

ORDER BY
    total_followers DESC,
    days_to_reach ASC;
        `);
    }

}

exports.fetchAll = async (req, res, next) => {
    try {
        const artist = await Artist.fetchAll();
        res.status(200).json(artist[0]);
    } catch (error) {
        next(error);
    }
};







