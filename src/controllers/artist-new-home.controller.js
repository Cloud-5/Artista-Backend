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
    } catch (error) {
        console.error('Error fetching artist data:', error);
        next(error);
    }
}

exports.getAvailableArtworkCount = async (req, res, next) => {
    const artistId = req.params.artistId;

    try {
        const [rows] = await ArtistNewHome.getAvailableArtworkCount(artistId);
        const availableArtworks = rows[0].available_artworks;
        res.status(200).json({ availableArtworks });
    } catch (error) {
        console.error('Error fetching available artworks count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



