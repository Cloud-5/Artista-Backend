const db = require('../utils/database');

module.exports = class totalCreations {

    constructor(user_id){
        this.user_id = user_id;
    
    }

    static fetchTotalCreations(user_id) {
        return db.execute('SELECT COUNT(artwork_id) FROM artwork WHERE artist_id = ?', [user_id]);
    }
}