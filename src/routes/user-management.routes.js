const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/user-management.controller');
const { getArtistDetails } = require('../controllers/artist-request.controller');

router.get('/approved-artists', userManagementController.getApprovedArtists);
router.get('/registered-customers', userManagementController.getRegisteredCustomers);
router.delete('/delete-account/:userId', userManagementController.deleteAccount);
router.put('/ban-account/:userId', userManagementController.banAccount);
router.put('/remove-ban/:userId', userManagementController.removeBan);
router.get('/deleted-accounts', userManagementController.getDeletedAccounts);
router.get('/banned-accounts', userManagementController.getBannedAccounts);

router.get('/artist-details/:id', userManagementController.getArtistDetails);

module.exports = router;
