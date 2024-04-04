const db = require('../utils/database');

class ArtPreview {
    static getArtDetails(artId) {
        return db.execute(`SELECT 
        a.title AS artwork_name,
        CONCAT(u.fName, ' ', u.LName) AS artist,
        u.profession AS profession,
        u.location AS location,
        c.name AS category,
        a.price AS price,
        a.published_date AS published_date,
        COALESCE(al.total_likes, 0) AS total_likes,
        a.description AS description,
        GROUP_CONCAT(DISTINCT ato.tool_name) AS tools,
        GROUP_CONCAT(DISTINCT af.file_format_name) AS formats,
        GROUP_CONCAT(DISTINCT atg.tag_name) AS tags,
        a.thumbnail_url AS url_link,
        COUNT(DISTINCT a2.artwork_id) AS total_creations,
        AVG(ar.rating_value) AS avg_rating,
        COUNT(DISTINCT afollower.follower_user_id) AS followers_count,
        u.description AS artist_description,
        u.profile_photo_url AS artist_profile_photo,
        COUNT(DISTINCT com.comment_id) AS total_comments
    FROM 
        artwork a
    JOIN 
        user u ON a.artist_id = u.user_id
    JOIN 
        category c ON a.category_id = c.category_id
    LEFT JOIN 
        (SELECT artwork_id, COUNT(*) AS total_likes FROM artwork_like GROUP BY artwork_id) al 
        ON a.artwork_id = al.artwork_id
    LEFT JOIN 
        artwork_tool ato ON a.artwork_id = ato.artwork_id
    LEFT JOIN 
        artwork_file_format af ON a.artwork_id = af.artwork_id
    LEFT JOIN 
        artwork_tag atg ON a.artwork_id = atg.artwork_id
    LEFT JOIN 
        artwork a2 ON a.artist_id = a2.artist_id
    LEFT JOIN 
        artist_rating ar ON u.user_id = ar.rated_user_id
    LEFT JOIN 
        artist_follower afollower ON u.user_id = afollower.followed_artist_user_id
    LEFT JOIN
        comment com ON a.artwork_id = com.artwork_id
    WHERE 
        a.artwork_id = 3
    GROUP BY 
        a.artwork_id;
    `, [artId]);
    }

    static getComments(artId) {
        return db.execute(
            'SELECT c.*, u.username FROM comment c JOIN user u ON c.user_id = u.user_id WHERE c.artwork_id = ?', 
            [artId]
        );
    }
    static InsertLike(artId, userId){
        return db.execute('INSERT INTO artwork_like (artwork_id, user_id) VALUES (?, ?)', [artId, userId]);
    }
    static InsertFollow(customerId, artistId){
        return db.execute('INSERT INTO artist_follower (follower_user_id, followed_artist_user_id) VALUES (?, ?)', [customerId, artistId]);
    }
    
}

exports.artworkPreview = async (req, res, next) => {
    const artId = req.params.artId;
    try {
        const artworkDetails = await ArtPreview.getArtDetails(artId);
        const comments = await ArtPreview.getComments(artId);
        const responseData = {
            artworkDetails: artworkDetails[0],
            comments: comments[0]
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error getting artwork details or comments:', error);
        next(error);
    }
}

exports.likeArtwork = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.InsertLike(artId, userId);
        res.status(201).json({ message: 'Artwork liked successfully' });
    } catch (error) {
        console.error('Error liking artwork:', error);
        next(error);
    }
}

exports.followArtist = async (req, res, next) => {
    const artistId = req.params.artistId;
    const customerId = req.body.customerId;
    try {
        await ArtPreview.InsertFollow(customerId, artistId);
        res.status(201).json({ message: 'Artist followed successfully' });
    } catch (error) {
        console.error('Error following artist:', error);
        next(error);
    }
}

