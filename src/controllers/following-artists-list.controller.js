const FollowingArtistsList  = require('../services/following-artists-list.service');

exports.getFollowedArtistsList = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const followedArtists = await FollowingArtistsList.getFollowedArtists(userId);
        res.status(200).json(followedArtists);
    } catch (error) {
        console.error('Error fetching followed artists list:', error);
        next(error);
    }
}

exports.unfollowArtist = async (req, res, next) => {
    const artistId = req.params.artistId;
    const customerId = req.body.userId;

    console.log('Received artistId:', artistId);
    console.log('Received customerId:', customerId);

    if (!customerId || !artistId) {
        return res.status(400).json({ message: 'User ID and Artist ID are required' });
    }

    try {
        await FollowingArtistsList.deleteFollow(customerId, artistId);
        res.status(200).json({ message: 'Artist unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing artist:', error);
        next(error);
    }
}