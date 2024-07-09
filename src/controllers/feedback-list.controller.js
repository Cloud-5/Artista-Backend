const db = require("../utils/database");

class FeedbackList {
  static async getFeedbackList(artistUserId) {
    console.log('artistUserId', artistUserId);
    try {
      const feedbackList = await db.execute(
        `
            SELECT 
                u.profile_photo_url,
                u.username AS customer_name,
                f.content AS feedback_content,
                f.created_at AS timestamp
            FROM 
                feedback f
            JOIN 
                user u ON f.customer_user_id = u.user_id
            WHERE 
                f.artist_user_id = ?;
            `,
        [artistUserId]
      );
      return feedbackList;
    } catch (error) {
      throw new Error("Error fetching feedback list: " + error.message);
    }
  }
}

exports.getFeedbackList = async (req, res, next) => {
  const artistUserId = req.params.artistUserId;
  console.log('artist==========', artistUserId)
  try {
    const feedbackList = await FeedbackList.getFeedbackList(artistUserId);
    res.status(200).json(feedbackList[0]);
  } catch (error) {
    console.error("Error fetching feedback list:", error);
    next(error);
  }
};
