
const db = require('../utils/database');


class artistRequest {
  static getRequestedArtists() {
    return db.execute('SELECT profile_photo_url, fName, LName, role, location, registered_at FROM user WHERE role = "artist" AND is_approved = FALSE');
  }

  static getArtistDetails(userId) {
    return db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
  }

  static approveArtist(userId) {
    return db.execute('UPDATE user SET is_approved = TRUE WHERE user_id = ?', [userId]);
  }

  static rejectArtist(userId) {
    return db.execute('DELETE FROM user WHERE user_id = ?', [userId]);
  }

  static getFollowers(userId) {
    return db.execute(`SELECT 
    user.user_id AS follower_user_id,
    user.username AS follower_username,
    user.description AS follower_description,
    user.registered_at AS follower_registered_at,
    user.profession AS follower_profession,
    user.location AS follower_location,
    user.fName AS follower_first_name,
    user.LName AS follower_last_name,
    user.profile_photo_url AS follower_profile_photo_url,
    user.role AS follower_role,
    user.isActive AS follower_isActive,
    user.isBanned AS follower_isBanned,
    user.ban_start_date AS follower_ban_start_date,
    user.ban_end_date AS follower_ban_end_date,
    user.is_approved AS follower_is_approved
FROM 
    artist_follower
JOIN 
    user ON artist_follower.follower_user_id = user.user_id
WHERE 
    artist_follower.followed_artist_user_id = ?`,[userId]);
  }
}



exports.getRequestedArtists = async (req, res, next) => {
  try {
    const requestedArtists = await artistRequest.getRequestedArtists();
    res.status(200).json(requestedArtists[0]);
  } catch (error) {
    console.error('Error getting requested artists:', error);
    next(error);
  }
};

exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const artistDetails = await artistRequest.getArtistDetails(userId);
    res.status(200).json(artistDetails[0][0]);
  } catch (error) {
    console.error('Error getting artist details:', error);
    next(error);
  }
};

exports.approveArtist = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistRequest.approveArtist(userId);
    res.status(200).json({ message: 'Artist approved successfully!' });
  } catch (error) {
    console.error('Error approving artist:', error);
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await artistRequest.deleteAccount(userId);
    res.status(200).json({ message: 'Account deleted successfully!' });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};

exports.getFollowers = async (req, res, next) =>{
  const userId = req.params.userId;
  try{
    const followers = await artistRequest.getFollowers(userId);
    res.status(200).json(followers[0]);
  }
  catch(error){
    console.error('Error getting followers:', error);
    next(error);
  }
}


