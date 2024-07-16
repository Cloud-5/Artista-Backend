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










}


module.exports = artistNewHome; 