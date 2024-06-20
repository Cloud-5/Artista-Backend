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
    static async deleteFollow(customerId, artistId) {
        if (customerId === undefined || artistId === undefined) {
            throw new Error('CustomerId and ArtistId must not be undefined');
        }
        
        try {
            await db.execute('DELETE FROM artist_follower WHERE follower_user_id = ? AND followed_artist_user_id = ?', [customerId, artistId]);
        } catch (error) {
            throw new Error('Error unfollowing artist: ' + error.message);
        }
    }

}

module.exports = FollowingArtistsList;


