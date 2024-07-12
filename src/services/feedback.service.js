const db = require("../utils/database")

module.exports = class Feedback {
    static async postFeedback(artistId, userId, feedback) {
        return db.execute(`INSERT INTO artist_feedback (artist_user_id, customer_user_id, content) VALUES (?,?,?)`, [artistId, userId, feedback]);
    }

    static async getFeedbacksForArtist(artistId) {
        return db.execute(`SELECT * FROM artist_feedback WHERE artist_user_id = ?`, [artistId]);
    }

    static async deleteFeedback(feedbackId) {
        return db.execute(`DELETE FROM artist_feedback WHERE feedback_id = ?`, [feedbackId]);
    }

    static async updateFeedback(feedbackId, content) {
        return db.execute(`UPDATE artist_feedback SET content = ? WHERE feedback_id = ?`, [content, feedbackId]);
    }
}