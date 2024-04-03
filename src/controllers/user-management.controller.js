const db = require('../utils/database');

class userManagement {
  static getApprovedArtists() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at, profession FROM user WHERE role = "artist" AND is_approved = TRUE and is_rejected=FALSE and isBanned=FALSE and isActive=TRUE');
  }

  static getRegisteredCustomers() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "customer" and isActive=TRUE and isBanned=FALSE');
  }

  static getDeletedAccounts() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE isActive=FALSE');
  }

  static getBannedAccounts() {
    return db.execute('SELECT user_id,profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE isBanned=TRUE and isActive=TRUE');
  }

  static getUserSummary() {
    return db.execute(`
    SELECT
        SUM(CASE WHEN role = 'artist' AND is_approved = TRUE AND is_rejected = FALSE AND isBanned = FALSE AND isActive = TRUE THEN 1 ELSE 0 END) AS total_approved_artists,
        SUM(CASE WHEN role = 'customer' AND isActive = TRUE AND isBanned = FALSE THEN 1 ELSE 0 END) AS total_registered_customers,
        SUM(CASE WHEN isActive = FALSE THEN 1 ELSE 0 END) AS total_deleted_accounts,
        SUM(CASE WHEN isBanned = TRUE AND isActive = TRUE THEN 1 ELSE 0 END) AS total_banned_accounts,
        SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) + SUM(CASE WHEN role = 'artist' AND is_approved = TRUE THEN 1 ELSE 0 END) AS total_registered_users
    FROM user`)
  }

  static banUser(userId, banStartDate, banEndDate, banReason) {
    return db.execute('UPDATE user SET isBanned = TRUE, ban_start_date = ?, ban_end_date = ?, ban_reason = ? WHERE user_id = ?', [banStartDate, banEndDate, banReason, userId]);
  }

  static removeBan(userId) {
    return db.execute('UPDATE user SET isBanned = FALSE, ban_reason = NULL,ban_start_date = NULL, ban_end_date = NULL  WHERE user_id = ?', [userId]);
}


  static deleteUser(userId) {
    return db.execute('UPDATE user SET isActive = FALSE WHERE user_id = ?', [userId]);
  }
  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }

}

exports.getAllUserData = async (req, res, next) => {
  try {
    const [
      approvedArtists,
      registeredCustomers,
      deletedAccounts,
      bannedAccounts,
      userSummary
    ] = await Promise.all([
      userManagement.getApprovedArtists(),
      userManagement.getRegisteredCustomers(),
      userManagement.getDeletedAccounts(),
      userManagement.getBannedAccounts(),
      userManagement.getUserSummary()
    ]);

    const summaryData = userSummary[0][0];
    // Construct the response object
    const responseData = {
      approvedArtists: approvedArtists[0],
      registeredCustomers: registeredCustomers[0],
      deletedAccounts: deletedAccounts[0],
      bannedAccounts: bannedAccounts[0],
      totalUserRegistrations: summaryData.total_registered_users,
      totalApprovedArtists: summaryData.total_approved_artists,
      totalRegisteredCustomers: summaryData.total_registered_customers,
      totalDeletedAccounts: summaryData.total_deleted_accounts,
      totalBannedAccounts: summaryData.total_banned_accounts
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    next(error);
  }
};

exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const artistDetails = await userManagement.getArtistDetails(userId);
    res.status(200).json(artistDetails[0][0]);
  } catch (error) {
    console.error('Error getting artist details:', error);
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await userManagement.deleteUser(userId);
    res.status(200).json({ message: 'Account deleted successfully!' });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};

exports.banAccount = async (req, res, next) => {
  const userId = req.params.userId;
  const {banStartDate, banEndDate, banReason} = req.body;

  try {
    await userManagement.banUser(userId, banStartDate, banEndDate, banReason);
    res.status(200).json({ message: 'Account banned successfully!' });
  } catch (error) {
    console.error('Error banning account:', error);
    next(error);
  }
};

exports.removeBan = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await userManagement.removeBan(userId);
    res.status(200).json({ message: 'Ban removed successfully!' });
  } catch (error) {
    console.error('Error removing ban:', error);
    next(error);
  }
};

