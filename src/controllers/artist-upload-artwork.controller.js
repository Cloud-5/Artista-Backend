const { uploadFileToS3, getArtwork, deleteArtwork } = require('../services/artworkService');

exports.uploadArtwork = async (req, res, next) => {
  try {
    const artworkFile = req.files.artworkFile[0];
    const artworkUpload = await uploadFileToS3(artworkFile, 'artworks');
    const artworkUrl = artworkUpload.Location;

    res.status(201).json({ message: 'Artwork uploaded successfully', artworkUrl });
  } catch (error) {
    next(error);
  }
};

exports.getArtworkDetails = async (req, res, next) => {
  const artworkId = req.params.artworkId;
  try {
    const artworkDetails = await getArtwork(artworkId);
    if (!artworkDetails) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    res.status(200).json(artworkDetails);
  } catch (error) {
    next(error);
  }
};

exports.deleteArtwork = async (req, res, next) => {
  const artworkId = req.params.artworkId;
  try {
    await deleteArtwork(artworkId);
    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    next(error);
  }
};
