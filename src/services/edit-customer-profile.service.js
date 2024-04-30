const db = require("../utils/database");

class EditCustomerProfile {
  static update(
    userId,
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
                fName = ?,
                LName = ?,
                description = ?,
                email = ?,
                password_hash = ?,
                location = ?
            WHERE 
                user_id = ?
            `,
      [firstName, lastName, description, email, newPassword, location, userId]
    );
  }

  static updateWithoutPassword(
    userId,
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
                fName = ?,
                LName = ?,
                description = ?,
                email = ?,
                location = ?
            WHERE 
                user_id = ?
            `,
      [firstName, lastName, description, email, location, userId]
    );
  }
}

module.exports = { EditCustomerProfile };
