const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/artist-feedback.controller');

// Define route to get feedback for an artist by artist's ID
// router.get('/:artistId',feedbackController.getFeedbacks );
// router.post('/',feedbackController.postFeedback);
// router.delete('/',feedbackController.deleteFeedback);
// router.put('/',feedbackController.updateFeedback);

module.exports = router;
