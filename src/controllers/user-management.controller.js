const User = require('../models/user-management.model');

exports.getApprovedArtists = async (req, res, next) => {
    try {
        const approvedArtists = await User.getApprovedArtists();
        res.status(200).json(approvedArtists[0]);
    } catch (error) {
        console.error('Error getting approved artists:', error);
        next(error);
    }
};

exports.getRegisteredCustomers = async (req, res, next) => {
    try {
        const registeredCustomers = await User.getRegisteredCustomers();
        res.status(200).json(registeredCustomers[0]);
    } catch (error) {
        console.error('Error getting registered customers:', error);
        next(error);
    }
};

exports.deleteAccount = async (req, res, next) => {
    const userId = req.params.userId;
  
    try {
      await User.deleteAccount(userId);
      res.status(200).json({ message: 'Account deleted successfully!' });
    } catch (error) {
      console.error('Error deleting account:', error);
      next(error);
    }
  };
  
  exports.banAccount = async (req, res, next) => {
    const userId = req.params.userId;
  
    try {
      await User.banAccount(userId);
      res.status(200).json({ message: 'Account banned successfully!' });
    } catch (error) {
      console.error('Error banning account:', error);
      next(error);
    }
  };
  
  exports.removeBan = async (req, res, next) => {
    const userId = req.params.userId;
  
    try {
      await User.removeBan(userId);
      res.status(200).json({ message: 'Ban removed successfully!' });
    } catch (error) {
      console.error('Error removing ban:', error);
      next(error);
    }
  };
  
  exports.getDeletedAccounts = async (req, res, next) => {
    try {
      const deletedAccounts = await User.getDeletedAccounts();
      res.status(200).json(deletedAccounts[0]);
    } catch (error) {
      console.error('Error getting deleted accounts:', error);
      next(error);
    }
  };
  
  exports.getBannedAccounts = async (req, res, next) => {
    try {
      const bannedAccounts = await User.getBannedAccounts();
      res.status(200).json(bannedAccounts[0]);
    } catch (error) {
      console.error('Error getting banned accounts:', error);
      next(error);
    }
  };

  exports.getArtistDetails = async (req, res, next) => {
    const { id } = req.params;
    try {
      const artistData = await User.getArtistDetails(id);
      res.status(200).json(artistData);
    } catch (error) {
      console.error("Error getting artist details:", error);
      next(error);
    }
  }