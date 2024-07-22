const db = require('../utils/database');



class ArtistFollowers{
  static fetchFollowers(artistId){
    return db.execute('SELECT u.user_id AS userId ,u.username AS name, u.location AS country, u.profile_photo_url FROM artist_follower af JOIN user u ON af.follower_user_id = u.user_id WHERE af.followed_artist_user_id = ?',[artistId]);
  }
}


class deleteFollower {
  static deleteFollower(artistId,followerId){
    return db.execute('DELETE FROM artist_follower WHERE followed_artist_user_id = ? AND follower_user_id = ?',[artistId, followerId])
  }
}

exports.getArtistFollowers = async (req,res,next)=>{
  const artistId = req.params.artistId;
  try {
    const followers = await ArtistFollowers.fetchFollowers(artistId);
    res.status(200).json(followers[0]);
  } catch (error) {
    console.error('Error fetching artist followers:', error);
    next(error);
  }
}

exports.deleteFollower = async (req,res,next)=>{
  const artistId = req.params.artistId;
  const followerId = req.params.followerId;
  console.log('this is artistId and follower Id from follower artist function ',artistId,followerId)
  try {
    const result = await deleteFollower.deleteFollower(artistId,followerId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting follower:', error);
    next(error);
  }
}


