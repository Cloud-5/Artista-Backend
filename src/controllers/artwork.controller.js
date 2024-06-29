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

exports.postArtwork = async (req, res, next) => {
    try {
        await Artwork.postArtwork(...req.body);
        res.status(200).json({ message: "Artwork posted successfully!" });
    } catch (error) {
        console.error("Error posting artwork:", error);
    }
}

exports.updateArtwork = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
    try {
        await Artwork.updateArtwork(id, ...req.body);
        res.status(200).json({ message: "Artwork updated successfully!" });
    } catch (error) {
        console.error("Error updating artwork:", error);
    }
}

exports.deleteArtwork = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Artwork.deleteArtwork(id);
        res.status(200).json({ message: "Artwork deleted successfully!" });
    } catch (error) {
        console.error("Error deleting artwork:", error);
    }
}