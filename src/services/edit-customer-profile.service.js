const db = require("../utils/database");

class EditCustomerProfile {
  static update(
    userId,
    banner_img_url,
    profile_photo_url,
    firstName,
    lastName,
    description,
    email,
    newPassword,
    location
  ) {
    return db.execute(
      `
            UPDATE 
                user 
            SET 
                banner_img_url = ?,
                profile_photo_url = ?,
                fName = ?,
                LName = ?,
                description = ?,
                email = ?,
                password_hash = ?,
                location = ?
            WHERE 
                user_id = ?
            `,
      [banner_img_url,profile_photo_url,firstName, lastName, description, email, newPassword, location, userId]
    );
  }

  static updateWithoutPassword(
    userId,
    banner_img_url,
    profile_photo_url,
    firstName,
    lastName,
    description,
    email,
    location
  ) {
    return db.execute(
      `
            UPDATE 
                user 
            SET 
                banner_img_url = ?,
                profile_photo_url = ?,
                fName = ?,
                LName = ?,
                description = ?,
                email = ?,
                location = ?
            WHERE 
                user_id = ?
            `,
      [banner_img_url,profile_photo_url,firstName, lastName, description, email, location, userId]
    );
  }
}

module.exports = { EditCustomerProfile };
