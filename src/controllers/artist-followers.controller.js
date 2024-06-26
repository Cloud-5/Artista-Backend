// // dhanushka
// const db=require('../utils/database');


// //controller function to get followers for an artist
// const getArtistFollowers=(req,res)=>{
//     const artist_id=req.params.artist_id;
// }

// const query='  SELECT u.username, u.location, u.profile_photo_url FROM artist_follower af JOIN user u ON af.follower_user_id = u.user_id WHERE af.followed_artist_user_id = 1';

//     db.query(query,[artist_id],(err,result)=>{
//         if(err){
//             console.error('Error fetching artist followers:',err);
//             return res.status(500).json({error: 'Internal server Error'});

//         }
//         res.status(200).json({followers:result});
//     });

// module.exports={getArtistFollowers};


const db = require('../utils/database');

// Controller function to get followers for an artist
const getArtistFollowers = (req, res) => {
  const artist_id = req.params.artistId;

  const query = 'SELECT u.username AS name, u.location AS country, u.profile_photo_url FROM artist_follower af JOIN user u ON af.follower_user_id = u.user_id WHERE af.followed_artist_user_id = ?';

  db.query(query, [artist_id], (err, result) => {
    if (err) {
      console.error('Error fetching artist followers:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ followers: result });
  });
};

module.exports = { getArtistFollowers };
