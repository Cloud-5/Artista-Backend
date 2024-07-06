const db = require("../utils/database");

class EditCustomerProfile {
  static update(
    userId,
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
      [profile_photo_url,firstName, lastName, description, email, newPassword, location, userId]
    );
  }

  static updateWithoutPassword(
    userId,
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
                profile_photo_url = ?,
                fName = ?,
                LName = ?,
                description = ?,
                email = ?,
                location = ?
            WHERE 
                user_id = ?
            `,
      [profile_photo_url,firstName, lastName, description, email, location, userId]
    );
  }
}

module.exports = { EditCustomerProfile };
