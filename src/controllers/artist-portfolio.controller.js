const db = require("../utils/database");
const artistUploadArtworks=require('../services/artist-upload-artwork.service');

class ArtistPortfolio {
  static fetchArtistDetails(artistId, customerId) {
    console.log('artistId:', artistId, 'customerId:', customerId);
    return db.execute(
      `SELECT
        u.username AS artist_name,
        u.fName,
        u.LName,
        u.description AS artist_description,
        u.registered_at AS joined_date,
        u.location AS artist_location,
        u.profession AS artist_profession,
        COUNT(DISTINCT al.artwork_id) AS total_likes,
        COUNT(DISTINCT af.follower_user_id) AS total_followers,
        COUNT(DISTINCT a.artwork_id) AS total_creations,
        u.description,
        u.profile_photo_url,
        u.banner_img_url,
        CASE 
          WHEN afollower.followed_artist_user_id IS NOT NULL THEN 1 
          ELSE 0 
        END AS is_following,
        AVG(ar.rating_value) AS average_rating
      FROM
        user u
      LEFT JOIN
        artwork_like al ON u.user_id = al.user_id
      LEFT JOIN
        artist_follower af ON u.user_id = af.followed_artist_user_id
      LEFT JOIN
        artwork a ON u.user_id = a.artist_id
      LEFT JOIN 
        artist_follower afollower ON u.user_id = afollower.followed_artist_user_id AND afollower.follower_user_id = ?
      LEFT JOIN
        artist_rating ar ON u.user_id = ar.rated_user_id
      WHERE
        u.user_id = ?
      GROUP BY
        u.user_id;`,
      [customerId, artistId]
    );
  }
  

  static insertFeedback(artistId, feedback, customerId) {
    return db.execute(
      `INSERT INTO feedback (artist_user_id, content, customer_user_id)
      VALUES (?, ?, ?);`,
      [artistId, feedback, customerId]
    );
  }

  static insertRating(ratedUserId, ratingUserId, ratingValue) {
    return db.execute(
      `INSERT INTO artist_rating (rated_user_id, rating_user_id, rating_value)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating_value = ?;`,
      [ratedUserId, ratingUserId, ratingValue, ratingValue]
    );
  }

  static insertFollow(customerId, artistId) {
    return db.execute(
      "INSERT INTO artist_follower (follower_user_id, followed_artist_user_id) VALUES (?, ?)",
      [customerId, artistId]
    );
  }

  static deleteFollow(customerId, artistId) {
    return db.execute(
      "DELETE FROM artist_follower WHERE follower_user_id = ? AND followed_artist_user_id = ?",
      [customerId, artistId]
    );
  }

  static getSocial(artistId) {
    return db.execute(
      'call GetSocialAccounts(?)',[artistId]
    );
  }
}

exports.getArtistDetails = async (req, res, next) => {
  const artistId = req.params.artistId;
  const customerId = req.params.customerId;
  try {
    const artistDetails = await ArtistPortfolio.fetchArtistDetails(artistId, customerId);
    const social = await ArtistPortfolio.getSocial(artistId);
    const response = {
      artistDetails:artistDetails[0],
      social: social[0][0]
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching artist details:", error);
    next(error);
  }
};

exports.postFeedback = async (req, res, next) => {
  const artistId = req.params.artistId;
  const { feedback, customerId } = req.body;
  try {
    await ArtistPortfolio.insertFeedback(artistId, feedback, customerId);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    next(error);
  }
};

exports.postRating = async (req, res, next) => {
  const artistId = req.params.artistId;
  const { ratingValue, customerId } = req.body;
  try {
    await ArtistPortfolio.insertRating(artistId, customerId, ratingValue);
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    next(error);
  }
};

exports.followArtist = async (req, res, next) => {
  const artistId = req.params.artistId;
  const customerId = req.body.userId;
  try {
      await ArtistPortfolio.insertFollow(customerId, artistId);
      res.status(201).json({ message: 'Artist followed successfully' });
  } catch (error) {
      console.error('Error following artist:', error);
      next(error);
  }
};

exports.unfollowArtist = async (req, res, next) => {
  const artistId = req.params.artistId;
  const customerId = req.body.userId;
  try {
      await ArtistPortfolio.deleteFollow(customerId, artistId);
      res.status(200).json({ message: 'Artist unfollowed successfully' });
  } catch (error) {
      console.error('Error unfollowing artist:', error);
      next(error);
  }
};



