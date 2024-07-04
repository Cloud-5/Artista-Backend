const Feedback = require("../services/feedback.service");
const db = require("../utils/database");

class ArtistFeedback {
    static getFeedbackSummaryForArtist(artistId) {
        return db.execute(
            'SELECT f.feedback_id, f.content, f.created_at, u.profile_photo_url, CONCAT(u.fName, " ", u.LName) AS full_name FROM feedback f  JOIN user u ON f.customer_user_id = u.user_id WHERE f.artist_user_id = 1',[artistId]
        );
    }
}

exports.getFeedbacks = async (req, res, next) => {
    const artistId = req.params.artistId;
    try {
        const feedback = await ArtistFeedback.getFeedbackSummaryForArtist(artistId);
        res.status(200).json(feedback[0]);
    } catch (error) {
        console.error('Error fetching artist feedback:', error);
        next(error);
    }
};

exports.updateFeedback = async (req, res, next) => {
    const feedbackId = req.params.feedbackId;
    const content = req.body.content;
    try {
        const result = await Feedback.updateFeedback(feedbackId, content);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating feedback:', error);
        next(error);
    }
}

exports.deleteFeedback = async (req, res, next) => {
    const feedbackId = req.params.feedbackId;
    try {
        const result = await Feedback.deleteFeedback(feedbackId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting feedback:', error);
        next(error);
    }
}

exports.postFeedback = async (req, res, next) => {
    const artistId = req.params.artistId;
    const userId = req.body.userId;
    const feedback = req.body.feedback;
    try {
        const result = await Feedback.postFeedback(artistId, userId, feedback);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error posting feedback:', error);
        next(error);
    }
}

