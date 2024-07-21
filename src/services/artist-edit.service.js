const db = require('../utils/database');

class artistEdit {

  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }
  static getSocialAccounts(userId) {
    return db.execute('CALL GetSocialAccounts(?)', [userId]);
  }
  static getSocialMeduaPlatforms() {
    return db.execute('SELECT * FROM social_media_platforms');
  }
 

  static updateArtist(artistId,fName, LName, location, description, profile_photo_url,banner_img_url, profession ) {
    console.log('dta in query',artistId,fName, LName, location, description, profile_photo_url,banner_img_url, profession)
    const query = `
      UPDATE user SET
        fName = ?,
        LName = ?,
        location = ?,
        description = ?,
        profile_photo_url = ?,
        banner_img_url = ?,
        profession = ?
        WHERE user_id = ?
    `;
    return db.execute(query, [fName, LName, location, description, profile_photo_url,banner_img_url, profession, artistId]);
   
   
  }

 static getFollowers(userId) {
    return db.execute('CALL GetFollowers(?)', [userId]);
  }


  static updateSocialMediaLink(user_id, platform_id, account_url) {
    const query = `UPDATE social_accounts
      SET account_url = ?
      WHERE user_id = ? AND platform_id = ?;`;          
    return db.execute(query, [account_url, user_id, platform_id]);
  }
}

module.exports = artistEdit;

