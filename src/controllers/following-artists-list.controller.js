const db = require('../utils/database');

class FollowingArtistsList {
    static async getFollowedArtists(userId) {
        try {
            const [followedArtists] = await db.execute(`
            SELECT 
            u.user_id,
            u.fName,
            u.LName,
            u.profile_photo_url,
            u.fName AS first_name,
            u.LName AS last_name,
            u.location,
            u.description,
            u.profession
        FROM 
            user u
        JOIN 
            artist_follower af ON u.user_id = af.followed_artist_user_id
        WHERE 
            af.follower_user_id = ?;
            `, [userId]);
            return followedArtists;
        } catch (error) {
            throw new Error('Error fetching followed artists: ' + error.message);
        }
    }

    static async removeFollowedArtist(userId, artistId) {
        try {
            await db.execute(`
                DELETE FROM 
                    artist_follower 
                WHERE 
                    follower_user_id = ? AND followed_artist_user_id = ?;
            `, [userId, artistId]);
        } catch (error) {
            throw new Error('Error removing followed artist: ' + error.message);
        }
    }
}

exports.getFollowedArtistsList = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const followedArtists = await FollowingArtistsList.getFollowedArtists(userId);
        res.status(200).json(followedArtists);
    } catch (error) {
        console.error('Error fetching followed artists list:', error);
        next(error);
    }
};

exports.removeFollowedArtist = async (req, res, next) => {
    const userId = req.params.userId;
    const artistId = req.params.artistId;
    try {
        await FollowingArtistsList.removeFollowedArtist(userId, artistId);
        res.status(200).json({ message: 'Followed artist removed successfully' });
    } catch (error) {
        console.error('Error removing followed artist:', error);
        next(error);
    }
};
