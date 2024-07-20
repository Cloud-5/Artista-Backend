const db = require('../utils/database');

class creation{
    static deleteArtwork(artworkId) {
        console.log('artwork id in service',artworkId);
        return  db.execute('UPDATE artwork SET availability = 0 WHERE artwork_id=?',[artworkId]);
    }
}

module.exports = creation;