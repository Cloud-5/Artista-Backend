const ArtistNewHome = require('../services/artist-new-home.service');

exports.getArtistData = async (req, res, next) => {
    const artistId = req.params.artistId;
    try {
        const artistData = await ArtistNewHome.getArtistData(artistId);
        const socialAccounts= await ArtistNewHome.getSocialAccounts(artistId);
        const rank =  await ArtistNewHome.getArtistRank(artistId);
        const responseData= { 
            artistData: artistData[0][0],
            socialAccounts: socialAccounts[0],
            rank: rank[0][0]
        
        }

        res.status(200).json(responseData);
        console.log('Artist data:', responseData);
    } catch (error) {
        console.error('Error fetching artist data:', error);
        next(error);
    }
}