const Artists = require('../models/artist-page.model');
const Creations = require('../models/artist-creations.model');
const Rating = require('../models/artist-rating.model');



exports.fetchAll = async (req, res, next) => {
    try {
        const artists = await Artists.fetchAll();

        const artistWithRatingsCreations = await Promise.all(
            artists[0].map(async (artist) => {
                const rating = await Rating.fetchRating(artist.user_id);
                const creations = await Creations.fetchTotalCreations(artist.user_id);

                return {
                    ...artist,
                    rating: rating[0], // Assuming rating_value is in the first row of the result
                    total_creations: creations[0] // Assuming COUNT(artwork_id) is in the first row of the result
                };
            })
        );

        res.status(200).json(artistWithRatingsCreations);
    } catch (error) {
        next(error);
    }
};
