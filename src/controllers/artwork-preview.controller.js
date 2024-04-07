const ArtPreview = require('../services/artwork-preview.service');

exports.artworkPreview = async (req, res, next) => {
    const artId = req.params.artId;
    try {
        const artworkDetails = await ArtPreview.getArtDetails(artId);
        const comments = await ArtPreview.getComments(artId);
        const responseData = {
            artworkDetails: artworkDetails[0],
            comments: comments[0]
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error getting artwork details or comments:', error);
        next(error);
    }
}

exports.likeArtwork = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.InsertLike(artId, userId);
        res.status(201).json({ message: 'Artwork liked successfully' });
    } catch (error) {
        console.error('Error liking artwork:', error);
        next(error);
    }
}

exports.followArtist = async (req, res, next) => {
    const artistId = req.params.artistId;
    const customerId = req.body.customerId;
    try {
        await ArtPreview.InsertFollow(customerId, artistId);
        res.status(201).json({ message: 'Artist followed successfully' });
    } catch (error) {
        console.error('Error following artist:', error);
        next(error);
    }
}

