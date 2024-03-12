const User = require('../models/artist-request.model');

exports.getRequestedArtists = async (req, res, next) => {
  try {
    const requestedArtists = await User.getRequestedArtists();
    res.status(200).json(requestedArtists[0]);
  } catch (error) {
    console.error('Error getting requested artists:', error);
    next(error);
  }
};

exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const artistDetails = await User.getArtistDetails(userId);
    res.status(200).json(artistDetails[0][0]);
  } catch (error) {
    console.error('Error getting artist details:', error);
    next(error);
  }
};

exports.approveArtist = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await User.approveArtist(userId);
    res.status(200).json({ message: 'Artist approved successfully!' });
  } catch (error) {
    console.error('Error approving artist:', error);
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

