// const artistRequest = require('../services/artist-request.service');
const artistedit =require('../services/artist-edit.service.js')




exports.getSocialMediaPlatforms = async(req,res)=>{
  try{
    const platforms = await artistedit.getSocialMeduaPlatforms();
    console.log('Platforms:',platforms);
    res.status(200).json(platforms[0]);
    
    
  }
  catch(error){
    res.status(500).json({error: 'field to get social media platforms.'})
  }
}


exports.getArtistDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const [artistDetails] = await artistedit.getArtistDetails(userId);
    if (artistDetails.length === 0) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(artistDetails[0]);
  } catch (error) {
    next(error);
  }
};

exports.getSocialAccounts =async(req,res,next)=>{
  const artistId=req.params.artistId;
  console.log(artistId,'fffffff')
  try{
      const socialAccounts=await artistedit.getSocialAccounts(artistId);
      return res.status(200).json(socialAccounts[0]);
  }
  catch(error){
    res.status(500).json({error :'fail to get Social media platfoms for artist'});
    
  }
}


  exports.updateArtist = async (req, res) => {
    try {
      const artistId = req.params.artistId;
      console.log('Artist ID:', artistId)
      const { fName, LName, location, description, profile_photo_url,banner_img_url, profession } = req.body;
      console.log('body,', req.body)
      const result = await artistedit.updateArtist(artistId,fName, LName, location, description, profile_photo_url,banner_img_url, profession);
      console.log(result,'service results');
      res.status(200).json({ message: 'Artist profile updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update artist profile.' });
    }
  };


  exports.updateSocialMediaLink = async (req, res) => {
    const artistId = req.params.artistId;
    const { platform_id, account_url } = req.body;
  
    try {
      const result = await artistedit.updateSocialMediaLink(artistId, platform_id, account_url);
      res.json({ message: 'Social media link updated successfully.' });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Failed to update social media link.' });
    }
  };
  


exports.getAllArtistData = async (req, res, next) => {
  try {
    const artists = await artistedit.getAllArtistData();
console.log('Artists details get succesfully:',artists);
    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artist data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateArtworkAvailability = async (req, res) => {
  const artworkId = req.body.artId;
  console.log('this is  artwork id from controller',artworkId);
  try {
    const result = await artistedit.updateArtworkAvailability(artworkId);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    res.status(200).json({ message: 'Artwork availability updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artwork availability.' });
  }
};