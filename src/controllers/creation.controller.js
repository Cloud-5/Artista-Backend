const creation = require('../services/creation.service.js')

exports.deleteArtwork = async (req, res) => {
    try {
        const artworkId = req.body.artId;
        console.log('Artwork ID:', artworkId)
        const result = await creation.deleteArtwork(artworkId);
        console.log(result, 'service results');
        res.status(200).json({ message: 'Artwork deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete artwork.' });
    }
}