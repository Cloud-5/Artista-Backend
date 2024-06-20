const db = require('../utils/database');

module.exports = class ArtistRating {

    constructor(user_id){
        this.user_id = user_id;
    
    }

    static fetchRating(user_id) {
        return db.execute('SELECT rating_value FROM artist_rating WHERE rated_user_id = ?', [user_id]);
    }
}               