const db = require("../utils/database");

class ArtPreview {
  static getArtDetails(artId, userId) {
    return db.execute(
      `SELECT 
    a.title AS artwork_name,
    CONCAT(u.fName, ' ', u.LName) AS artist,
    u.profession AS profession,
    u.firebase_uid AS firebase_uid,
    u.location AS location,
    u.user_id AS artist_id,
    c.name AS category,
    c.category_id AS category_id,
    a.price AS price,
    a.published_date AS published_date,
    COALESCE(al.total_likes, 0) AS total_likes,
    a.description AS description,
    GROUP_CONCAT(DISTINCT ato.tool_name) AS tools,
    GROUP_CONCAT(DISTINCT af.file_format_name) AS formats,
    GROUP_CONCAT(DISTINCT atg.tag_name) AS tags,
    a.original_url AS url_link,
    a.modelBackground AS background,
    a.thumbnail_url AS thumbnail,
    COUNT(DISTINCT a2.artwork_id) AS total_creations,
    COALESCE(AVG(ar.rating_value), 0) AS avg_rating,
    COUNT(DISTINCT af_followers.follower_user_id) AS followers_count,
    u.description AS artist_description,
    u.profile_photo_url AS artist_profile_photo,
    COUNT(DISTINCT com.comment_id) AS total_comments,
    CASE 
        WHEN a_like.user_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS is_liked,
    CASE 
        WHEN afollower.follower_user_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS is_following,
    CASE 
        WHEN g.artwork_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS is_addedToGallery,
    cust.profile_photo_url AS customer_profile_photo
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
    artist_follower af_followers ON u.user_id = af_followers.followed_artist_user_id
LEFT JOIN 
    comment com ON a.artwork_id = com.artwork_id
LEFT JOIN 
    artwork_like a_like ON a.artwork_id = a_like.artwork_id AND a_like.user_id = ?
LEFT JOIN 
    gallery g ON a.artwork_id = g.artwork_id AND g.customer_user_id = ?
LEFT JOIN 
    user cust ON cust.user_id = ?
LEFT JOIN 
    artist_follower afollower ON u.user_id = afollower.followed_artist_user_id AND afollower.follower_user_id = ?
WHERE 
    a.artwork_id = ?
GROUP BY 
    a.artwork_id, a.title, u.fName, u.LName, u.profession, u.firebase_uid, u.location, u.user_id, c.name, c.category_id, a.price, a.published_date, al.total_likes, a.description, a.original_url, a.modelBackground, a.thumbnail_url, u.description, u.profile_photo_url, cust.profile_photo_url, a_like.user_id, afollower.follower_user_id, g.artwork_id;

    `,
      [userId, userId, userId, userId, artId]
    );
  }

  static getBestArtworks(artistId) {
    return db.execute(
      `SELECT 
    a.artwork_id,
    a.artist_id,
    a.title,
    a.price,
    a.thumbnail_url,
    a.description,
    a.published_date,
    a.category_id,
    COALESCE(like_count, 0) AS like_count,
    COALESCE(comment_count, 0) AS comment_count,
    (COALESCE(like_count, 0) * 1) + (COALESCE(comment_count, 0) * 2) AS score
    FROM 
      artwork a
    LEFT JOIN 
      (SELECT artwork_id, COUNT(*) AS like_count 
      FROM artwork_like 
      GROUP BY artwork_id) al ON a.artwork_id = al.artwork_id
    LEFT JOIN 
      (SELECT artwork_id, COUNT(*) AS comment_count 
      FROM comment 
      GROUP BY artwork_id) c ON a.artwork_id = c.artwork_id
    WHERE 
      a.artist_id = ? AND a.availability = 1
    ORDER BY 
      score DESC
    LIMIT 10;`,
      [artistId]
    );
  }

  static getRelatedArtworks(artId,userId) {
    console.log(artId,userId);
    return db.execute("CALL GetRelatedArtworks(?,?);", [artId,userId]);
  }

  static getComments(artId) {
    return db.execute(
      "SELECT c.*, u.username,u.profile_photo_url FROM comment c JOIN user u ON c.user_id = u.user_id WHERE c.artwork_id = ?",
      [artId]
    );
  }

  static async insertComment(artId, userId, content) {
    try {
      const result = await db.execute(
        "INSERT INTO comment (user_id, artwork_id, content) VALUES (?, ?, ?)",
        [userId, artId, content]
      );

      // Get the ID of the inserted comment
      const insertedCommentId = result[0].insertId;

      // Retrieve the inserted comment from the database
      const insertedComment = await this.getCommentById(insertedCommentId);
      return insertedComment;
    } catch (error) {
      throw error;
    }
  }

  static async getCommentById(commentId) {
    try {
      const [commentRows, _] = await db.execute(
        "SELECT c.*, u.username FROM comment c JOIN user u ON c.user_id = u.user_id WHERE c.comment_id = ?",
        [commentId]
      );
      console.log("fetched comment", commentRows);
      if (commentRows.length === 0) {
        throw new Error("Comment not found");
      }
      return commentRows[0]; // Return the first comment (there should be only one)
    } catch (error) {
      throw error;
    }
  }

  static async insertReply(artId, userId, content, parentId) {
    try {
      const result = await db.execute(
        "INSERT INTO comment (user_id, artwork_id, content, parent_comment_id) VALUES (?, ?, ?, ?)",
        [userId, artId, content, parentId]
      );
      const insertedReplyId = result[0].insertId;
      const insertedReply = await this.getCommentById(insertedReplyId);
      return insertedReply;
    } catch (error) {
      throw error;
    }
    return db.execute();
  }

  static async updateComment(commentId, content) {
    try {
      const result = await db.execute(
        "UPDATE comment SET content = ? WHERE comment_id = ?",
        [content, commentId]
      );
      console.log("result", result);
      const updatedComment = await this.getCommentById(commentId);
      console.log("updated comment id", updatedComment);
      return updatedComment;
    } catch (error) {
      throw error;
    }
  }

  static deleteComment(commentId) {
    return db.execute("DELETE FROM comment WHERE comment_id = ?", [commentId]);
  }

  static InsertLike(artId, userId) {
    return db.execute(
      "INSERT INTO artwork_like (artwork_id, user_id, liked_at) VALUES (?, ?,  NOW())",
      [artId, userId]
    );
  }

  static DeleteLike(artId, userId) {
    return db.execute(
      "DELETE FROM artwork_like WHERE artwork_id = ? AND user_id = ?",
      [artId, userId]
    );
  }

  static InsertFollow(customerId, artistId) {
    return db.execute(
      "INSERT INTO artist_follower (follower_user_id, followed_artist_user_id, follow_date) VALUES (?, ?, NOW())",
      [customerId, artistId]
    );
  }

  static DeleteFollow(customerId, artistId) {
    return db.execute(
      "DELETE FROM artist_follower WHERE follower_user_id = ? AND followed_artist_user_id = ?",
      [customerId, artistId]
    );
  }

  static addToGallery(artId, userId) {
    return db.execute(
      "INSERT INTO gallery (artwork_id, customer_user_id) VALUES (?, ?)",
      [artId, userId]
    );
  }

  static removeFromGallery(artId, userId) {
    return db.execute(
      "DELETE FROM gallery WHERE artwork_id = ? AND customer_user_id = ?",
      [artId, userId]
    );
  }
}

module.exports = ArtPreview;
