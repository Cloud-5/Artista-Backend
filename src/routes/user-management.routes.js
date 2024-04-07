const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/user-management.controller');
const { getArtistDetails } = require('../controllers/artist-request.controller');

router.get('/', userManagementController.getAllUserData);
router.get('/:userId', userManagementController.getArtistDetails);
router.delete('/:userId', userManagementController.deleteAccount);
router.put('/ban/:userId', userManagementController.banAccount);
router.put('/remove-ban/:userId', userManagementController.removeBan);


router.get('/artist-details/:id', userManagementController.getArtistDetails);

module.exports = router;
