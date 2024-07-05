const db = require('../utils/database');

class Artistpage {
    static fetchAll({ page, limit, searchKeyword, sortBy, location, profession, featured }) {
        const offset = page * limit;
        let query = `
            SELECT user.*, 
                   (SELECT COUNT(artwork_id) FROM artwork WHERE artist_id = user.user_id) AS total_creations, 
                   (SELECT AVG(rating_value) FROM artist_rating WHERE rated_user_id = user.user_id) AS rating,
                   (SELECT COUNT(follower_user_id) FROM artist_follower WHERE followed_artist_user_id = user.user_id) AS follower_count
            FROM user 
            WHERE role = "artist"`;

        if (searchKeyword) {
            query += ` AND (username LIKE '%${searchKeyword}%' OR fName LIKE '%${searchKeyword}%' OR LName LIKE '%${searchKeyword}%'  OR profession LIKE '%${searchKeyword}%' OR location LIKE '%${searchKeyword}%')`;
        }

        if (location) {
            query += ` AND location = '${location}'`;
        }

        if (profession) {
            query += ` AND profession = '${profession}'`;
        }

        if (featured !== '') {
            query += ` AND featured = ${featured}`;
        }


        if (sortBy) {
            query += ` ORDER BY ${sortBy} DESC`;
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        console.log('Executing query:', query); // Log the final query

        return db.execute(query);
    
    
    }
    static fetchDistinctLocations() {
        return db.execute(`
        SELECT DISTINCT location 
        FROM user
        WHERE role = 'artist' AND location IS NOT NULL AND location != '';
        
        `);
    }

}

exports.fetchAll = async (req, res, next) => {
    const { page = 0, limit = 10, searchKeyword = '', sortBy = '', location = '', profession = '', featured = ''} = req.query;

    console.log('Received query params:', { page, limit, searchKeyword, sortBy, location, profession, featured }); // Log the received parameters

    try {
        const [artists] = await Artistpage.fetchAll({ page, limit, searchKeyword, sortBy, location, profession, featured });

        // Log artist data for debugging
        console.log('Artists data:', artists);

        res.status(200).json(artists);
    } catch (error) {
        next(error);
    }
};

exports.fetchDistinctLocations = async (req, res, next) => {
    try {
        const [locations] = await Artistpage.fetchDistinctLocations();

        // Log location data for debugging
        console.log('Locations data:', locations);

        res.status(200).json(locations);
    } catch (error) {
        next(error);
    }
};


