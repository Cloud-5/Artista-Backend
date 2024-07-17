const db = require("../utils/database");

class EditCustomerProfile {
  static update(
    userId,
    banner_img_url,
    profile_photo_url,
    firstName,
    lastName,
    description,
    location,
    phone
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
                location = ?
                phone = ?
            WHERE 
                user_id = ?
            `,
      [banner_img_url,profile_photo_url,firstName, lastName, description, location,phone, userId]
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
    location,
    phone
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
                phone = ?
            WHERE 
                user_id = ?
            `,
      [banner_img_url,profile_photo_url,firstName, lastName, description, email, location, phone, userId]
    );
  }
}

module.exports = { EditCustomerProfile };
