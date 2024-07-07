const db = require('../utils/database');

class artistEdit {


    

  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }


  static deleteArtist(userId){
    return db.execute('DELETE FROM user WHERE user_id = ?',[userId]);
  }

  static updateArtist( user_id , fName, lName, location, description, profile_photo_url, profession ) {
    const query = `
      UPDATE user SET
        fName = ?,
        lName = ?,
        location = ?,
        description = ?,
        profile_photo_url = ?,
        profession = ?
      WHERE user_id = ?
    `;
    return db.execute(query, [fName, lName, location, description, profile_photo_url, profession, user_id]);
   
   
  }
}

module.exports = artistEdit;