
const db = require('../utils/database');

class Artist {
    static fetchAll() {
        return db.execute(`
            SELECT 
    af.followed_artist_user_id, 
    CONCAT(u.fName, ' ', u.LName) AS artist_name,
    COUNT(DISTINCT af.follower_user_id) AS total_followers,
    COUNT(DISTINCT CASE WHEN af.follow_date >= CURDATE() - INTERVAL 1 MONTH THEN af.follower_user_id END) AS followers_last_month,
    u.profile_photo_url AS thumbnail_url,
    u.banner_img_url AS banner_url,
    u.profession AS artist_profession,
    u.location AS artist_location,
    MIN(af.follow_date) AS first_follow_date,
    MAX(af.follow_date) AS last_follow_date,
    DATEDIFF(MAX(af.follow_date), MIN(af.follow_date)) AS days_to_reach,
    AVG(ar.rating_value) AS rating
FROM 
    artist_follower af
JOIN
    user u ON af.followed_artist_user_id = u.user_id
LEFT JOIN
    artist_rating ar ON ar.rated_user_id = u.user_id
GROUP BY 
    af.followed_artist_user_id
HAVING
    followers_last_month > 0
ORDER BY
    followers_last_month DESC,
    total_followers DESC,
    days_to_reach ASC
LIMIT 20;


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







