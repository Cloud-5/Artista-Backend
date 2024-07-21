const db = require("../utils/database");
class artistNewHome{
    static getArtistData(userId) {
        return db.execute('CALL GetArtistDetails(?);', [userId]);
      }


      static getSocialAccounts(userId){
        return db.execute('CALL GetSocialAccounts(?);', [userId]);
      }
    
      static getArtistRank(userId){
        return db.execute('SELECT featured FROM user WHERE user_id=?;',[userId]);
      }



      static getAvailableArtworkCount(artistId) {
        const query = `
          SELECT COUNT(*) AS available_artworks
          FROM artwork
          WHERE artist_id = ?
          AND availability = 1;
        `;
        return db.execute(query, [artistId]);
      }






}


module.exports = artistNewHome; 