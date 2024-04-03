const { resolve } = require("path");
const db = require("../utils/database");
const { rejects } = require("assert");

module.exports = class User {
  static async getArtistDetails(userId) {
    const data = new Promise((resolve, reject) => {
        const gallery = db.execute(
            `SELECT COUNT(artist_id) as count FROM artwork WHERE artist_id=${userId}`
          ).then((res) => {
              const galleryCount = res[0][0].count;
              const followers = db.execute(
                  `SELECT COUNT(follower_user_id) as count FROM artist_follower WHERE followed_artist_user_id=${userId}`
                ).then((res2) => {
                  const followerCount = res2[0][0].count;
                  const user = db.execute(`
                  SELECT profile_photo_url, fName, LName, role, location, registered_at, description FROM user WHERE user_id = ${userId}`)
                  .then((res3) => {
                      const userData = res3[0][0];
                      const res = { ...userData, gallery: galleryCount, followers: followerCount };
                      console.log(res);
                      resolve(res);
                  })
                })
          });
    })

    return await data;
  }

  static getApprovedArtists() {
    return db.execute(
      'SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "artist" AND is_approved = TRUE'
    );
  }

  static getRegisteredCustomers() {
    return db.execute(
      'SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "customer"'
    );
  }

  static deleteAccount(userId) {
    return db.execute("UPDATE user SET isActive = FALSE WHERE user_id = ?", [
      userId,
    ]);
  }

  static banAccount(userId) {
    return db.execute("UPDATE user SET isBanned = TRUE WHERE user_id = ?", [
      userId,
    ]);
  }

  static removeBan(userId) {
    return db.execute("UPDATE user SET isBanned = FALSE WHERE user_id = ?", [
      userId,
    ]);
  }

  static getDeletedAccounts() {
    return db.execute(
      "SELECT profile_photo_url, fName, LName, role, location, registered_at from user WHERE isActive = FALSE"
    );
  }

  static getBannedAccounts() {
    return db.execute(
      "SELECT profile_photo_url, fName, LName, role, location, registered_at from user WHERE isBanned = TRUE"
    );
  }
};
