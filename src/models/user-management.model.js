const db = require('../utils/database');

module.exports = class User {

    static getArtistDetails(userId) {
        return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE user_id = ?', [userId]);
    }

    static getApprovedArtists() {
        return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "artist" AND is_approved = TRUE');
    }

    static getRegisteredCustomers() {
        return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "customer"');
    }

    static deleteAccount(userId) {
        return db.execute('UPDATE user SET isActive = FALSE WHERE user_id = ?', [userId]);
    }

    static banAccount(userId) {
        return db.execute('UPDATE user SET isBanned = TRUE WHERE user_id = ?', [userId]);
    }

    static removeBan(userId) {
        return db.execute('UPDATE user SET isBanned = FALSE WHERE user_id = ?', [userId]);
    }

    static getDeletedAccounts() {
        return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at from user WHERE isActive = FALSE');
    }

    static getBannedAccounts() {
        return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at from user WHERE isBanned = TRUE');
    }
}
