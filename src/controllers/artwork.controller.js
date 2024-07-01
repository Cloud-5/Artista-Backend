const Artwork = require("../services/artwork.service")

exports.getArtworksForArtist = async (req, res, next) => {
    const { id }= req.params;
    try {
        const artworkData = await Artwork.getArtworkByArtistId(id);
        res.status(200).json(artworkData[0]);
    } catch (error) {
        console.error("Error getting artworks:", error);
    }
}

exports.getLikesForArtwork = async (req, res, next) => {
    const { id } = req.params;
    try {
        const data = await Artwork.getLikesForArtwork(id);
        res.status(200).json(data[0]);
    } catch (error) {
        console.error("Error getting like count:", error);
    }
}