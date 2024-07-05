const artistRequest = require('../services/artist-request.service');

exports.getArtistDetails = async (req, res, next) => {
    const userId = req.params.userId;
  
    try {
      const [artistDetails] = await artistRequest.getArtistDetails(userId);
      if (artistDetails.length === 0) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      res.status(200).json(artistDetails[0]);
    } catch (error) {
      next(error);
    }
  };

//   exports.updateArtist = async (req, res, next) => {
//     const userId = req.params.userId;
//     const updateFields = req.body; // Assuming req.body contains the fields to be updated
  
//     try {
//       await artistRequest.updateArtist(userId, updateFields);
//       res.status(200).json({ message: 'Artist details updated successfully' });
//     } catch (error) {
//       next(error);
//     }
//   };

  exports.updateArtist = async (req, res) => {
    try {
      const artistId = req.params.artistId;
      console.log('Artist ID:', artistId)
      const { fName, LName, location, description, profile_photo_url, profession } = req.body;
      console.log('body,', req.body)
      const updateArtistDetails = await artistRequest.updateArtist(artistId, fName, LName, location, description, profile_photo_url, profession);
      res.status(200).json({ message: 'Artist profile updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update artist profile.' });
    }
  };