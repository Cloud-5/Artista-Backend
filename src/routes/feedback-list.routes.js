const express = require('express');
const router = express.Router();
const FeedbackListController = require('../controllers/feedback-list.controller');
const Feedback = require('../services/feedback.service');

// Route to get feedback list for a specific artist
router.get('/:artistUserId', FeedbackListController.getFeedbackList);

module.exports = router;
