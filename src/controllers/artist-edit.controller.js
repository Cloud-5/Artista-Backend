// const artistRequest = require('../services/artist-request.service');
const artistedit =require('../services/artist-edit.service.js')







exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const [artistDetails] = await artistedit.getArtistDetails(userId);
    if (artistDetails.length === 0) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(artistDetails[0]);
  } catch (error) {
    next(error);
  }
};




  exports.updateArtist = async (req, res) => {
    try {
      const artistId = req.params.artistId;
      console.log('Artist ID:', artistId)
      const { fName, LName, location, description, profile_photo_url, profession } = req.body;
      console.log('body,', req.body)
      const updateArtistDetails = await artistedit.updateArtist(artistId, fName, LName, location, description, profile_photo_url, profession);
      res.status(200).json({ message: 'Artist profile updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update artist profile.' });
    }
  };







exports.getAllArtistData = async (req, res, next) => {
  try {
    const artists = await artistedit.getAllArtistData();

    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artist data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistedit.deleteArtist(userId);
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error("Error deleting account:", error);
    next(error);
  }
};


exports.getFollowers = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const followers = await artistedit.getFollowers(userId);
    res.status(200).json(followers[0]);
  } catch (error) {
    console.error("Error getting followers:", error);
    next(error);
  }
};