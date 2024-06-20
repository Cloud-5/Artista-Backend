const db = require('../utils/database');

class ArtPreview {
    static getArtDetails(artId, userId) {
        return db.execute(`SELECT 
        a.title AS artwork_name,
        CONCAT(u.fName, ' ', u.LName) AS artist,
        u.profession AS profession,
        u.location AS location,
        u.user_id AS artist_id,
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
        COUNT(DISTINCT com.comment_id) AS total_comments,
        CASE 
            WHEN a_like.user_id IS NOT NULL THEN 1 
            ELSE 0 
        END AS is_liked,
        CASE 
            WHEN afollower.followed_artist_user_id IS NOT NULL THEN 1 
            ELSE 0 
        END AS is_following,
        CASE 
            WHEN g.artwork_id IS NOT NULL THEN 1 
            ELSE 0 
        END AS is_addedToGallery
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
        artist_follower afollower ON u.user_id = afollower.followed_artist_user_id AND afollower.follower_user_id = ?
    LEFT JOIN
        comment com ON a.artwork_id = com.artwork_id
    LEFT JOIN
        artwork_like a_like ON a.artwork_id = a_like.artwork_id AND a_like.user_id = ?
    LEFT JOIN
        gallery g ON a.artwork_id = g.artwork_id AND g.customer_user_id = ?
    WHERE 
        a.artwork_id = ?
    GROUP BY 
        a.artwork_id;
    
    `, [userId, userId, userId, artId]);
    }

    static getComments(artId) {
        return db.execute(
            'SELECT c.*, u.username FROM comment c JOIN user u ON c.user_id = u.user_id WHERE c.artwork_id = ?',
            [artId]
        );
    }

    static insertComment(artId, userId, content) {
        return db.execute(
            'INSERT INTO comment (user_id, artwork_id, content) VALUES (?, ?, ?)',
            [userId, artId, content]
        )
    }
    static insertReply(artId, userId, content, parentId) {
        return db.execute(
            'INSERT INTO comment (user_id, artwork_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
            [userId, artId, content, parentId]
        );
    }

    static updateComment(commentId, content) {
        return db.execute(
            'UPDATE comment SET content = ? WHERE comment_id = ?',
            [content, commentId]
        );
    }

    static deleteComment(commentId) {
        return db.execute(
            'DELETE FROM comment WHERE comment_id = ?',
            [commentId]
        );
    }

    static InsertLike(artId, userId) {
        return db.execute('INSERT INTO artwork_like (artwork_id, user_id) VALUES (?, ?)', [artId, userId]);
    }

    static DeleteLike(artId, userId) {
        return db.execute('DELETE FROM artwork_like WHERE artwork_id = ? AND user_id = ?', [artId, userId]);
    }

    static InsertFollow(customerId, artistId) {
        return db.execute('INSERT INTO artist_follower (follower_user_id, followed_artist_user_id) VALUES (?, ?)', [customerId, artistId]);
    }

    static DeleteFollow(customerId, artistId) {
        return db.execute('DELETE FROM artist_follower WHERE follower_user_id = ? AND followed_artist_user_id = ?', [customerId, artistId]);
    }


    static addToGallery(artId, userId) {
        return db.execute('INSERT INTO gallery (artwork_id, customer_user_id) VALUES (?, ?)', [artId, userId]);
    }

    static removeFromGallery(artId, userId) {
        return db.execute('DELETE FROM gallery WHERE artwork_id = ? AND customer_user_id = ?', [artId, userId]);
    }

}

module.exports = ArtPreview;