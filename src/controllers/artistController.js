// const db = require('../utils/database');

// class Artist {
//   static fetchAll() {
//     return db.execute(`
//       SELECT 
//         a.title AS artwork_title,
//         a.price,
//         COUNT(al.artwork_id) AS total_likes,
//         CONCAT(u.fName, ' ', u.LName) AS artist_name,
//         u.firebase_uid,
//         u.profile_photo_url AS thumbnail_url
//       FROM 
//         artwork a
//       INNER JOIN 
//         user u ON a.artist_id = u.user_id
//       LEFT JOIN 
//         artwork_like al ON a.artwork_id = al.artwork_id
//       GROUP BY 
//         a.artwork_id, a.title, a.price, u.fName, u.LName, u.firebase_uid, u.profile_photo_url
//     `);
//   }
// }



// exports.fetchAll = async (req, res, next) => {
//     try {
//         const artist = await Artist.fetchAll();

//         res.status(200).json(artist[0]);
//     } catch (error) {
//         next(error);
// }
// }
const db = require('../utils/database');

class Artist {
    static fetchAll() {
        return db.execute(`
            SELECT a.title AS artwork_title, a.price, COUNT(al.artwork_id) AS total_likes,
                   CONCAT(u.fName, ' ', u.LName) AS artist_name, u.firebase_uid,
                   u.profile_photo_url AS thumbnail_url
            FROM artwork a
            INNER JOIN user u ON a.artist_id = u.user_id
            LEFT JOIN artwork_like al ON a.artwork_id = al.artwork_id
            GROUP BY a.artwork_id, a.title, a.price, u.fName, u.LName, u.firebase_uid, u.profile_photo_url
        `);
    }

    static fetchTrending(duration) {
        return db.execute(`
            SELECT 
                u.user_id,
                CONCAT(u.fName, ' ', u.LName) AS artist_name,
                u.firebase_uid,
                u.profile_photo_url AS thumbnail_url,
                COUNT(af.follower_user_id) AS follower_count
            FROM 
                user u
            LEFT JOIN 
                artist_follower af ON u.user_id = af.followed_artist_user_id
            WHERE 
                af.followed_artist_user_id >= NOW() - INTERVAL ? DAY
            GROUP BY 
                u.user_id, u.fName, u.LName, u.firebase_uid, u.profile_photo_url
            ORDER BY 
                follower_count DESC
        `, [duration]);
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

exports.fetchTrending = async (req, res, next) => {
    try {
        const duration = req.query.duration || 7; // Default duration to 7 days if not provided
        const trendingArtists = await Artist.fetchTrending(duration);
        res.status(200).json(trendingArtists[0]);
    } catch (error) {
        next(error);
    }
};




