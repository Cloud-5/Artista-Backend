const db = require("../utils/database");

class ArtistPortfolio {
  static fetchArtistDetails(artistId) {
    return db.execute(
      `
            SELECT
                u.username AS artist_name,
                u.description AS artist_description,
                u.registered_at AS joined_date,
                u.location AS artist_location,
                COUNT(DISTINCT al.artwork_id) AS total_likes,
                COUNT(DISTINCT af.follower_user_id) AS total_followers,
                COUNT(DISTINCT a.artwork_id) AS total_creations,
                u.description,
                u.profile_photo_url,
                u.banner_img_url
            FROM
                user u
            LEFT JOIN
                artwork_like al ON u.user_id = al.user_id
            LEFT JOIN
                artist_follower af ON u.user_id = af.followed_artist_user_id
            LEFT JOIN
                artwork a ON u.user_id = a.artist_id
            WHERE
                u.user_id = ?
            GROUP BY
                u.user_id;
        `,
      [artistId]
    );
  }

  static insertFeedback(artistId, feedback, customerId) {
    return db.execute(
      `
            INSERT INTO feedback (artist_user_id , feedback, customer_user_id)
            VALUES (?, ?, ?);
        `,
      [artistId, feedback, customerId]
    );
  }

  static insertFollow(customerId, artistId) {
    return db.execute(
      `
            INSERT INTO artist_follower (follower_user_id, followed_artist_user_id)
            VALUES (?, ?);
        `,
      [customerId, artistId]
    );
  }

  static DeleteFollow(customerId, artistId) {
    return db.execute(
      `
            DELETE FROM artist_follower
            WHERE follower_user_id = ? AND followed_artist_user_id = ?;
        `,
      [customerId, artistId]
    );
  }
}

exports.getArtistDetails = async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const artistDetails = await ArtistPortfolio.fetchArtistDetails(artistId);
    res.status(200).json(artistDetails[0]);
  } catch (error) {
    console.error("Error fetching artist details:", error);
    next(error);
  }
};

exports.postFeedback = async (req, res, next) => {
  const artistId = req.params.artistId;
  const feedback = req.body.feedback;
  const customerId = req.body.customerId;

  console.log("Artist ID:", artistId);
  console.log("Feedback:", feedback);
  console.log("Customer ID:", customerId);

  try {
    await ArtistPortfolio.insertFeedback(artistId, feedback, customerId);
    res.status(201).json({ message: "Feedback posted successfully" });
  } catch (error) {
    console.error("Error posting feedback:", error);
    next(error);
  }
};

exports.followArtist = async (req, res, next) => {
  const artistId = req.params.artistId;
  const customerId = req.body.userId;
  try {
    await ArtistPortfolio.insertFollow(customerId, artistId);
    res.status(201).json({ message: "Artist followed successfully" });
  } catch (error) {
    console.error("Error following artist:", error);
    next(error);
  }
};

exports.unfollowArtist = async (req, res, next) => {
  const artistId = req.params.artistId;
  const customerId = req.body.userId;
  try {
    await ArtistPortfolio.DeleteFollow(customerId, artistId);
    res.status(200).json({ message: "Artist unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing artist:", error);
    next(error);
  }
};
