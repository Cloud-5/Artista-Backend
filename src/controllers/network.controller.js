const ArtistNetwork = require("../models/network.model");

exports.getFollowersForArtists = async (req, res, next) => {
    const { id } = req.params;
    try {
        const data = await ArtistNetwork.getFollowers(id);
        res.status(200).json(data[0]);
    } catch (error) {
        console.error("Error getting followers:", error);
        next(error);
    }
}

exports.getFeedbacksForArtist = async (req, res, next) => {
    const { id } = req.params;
    try {
        const data = await ArtistNetwork.getFeedbacksForArtist(id);
        res.status(200).json(data[0]);
    } catch (error) {
        console.log("Error getting feedbacks:", error);
        next(error);
    }
}