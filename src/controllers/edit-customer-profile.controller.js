// Import necessary services
const { EditCustomerProfile } = require('../services/edit-customer-profile.service');

exports.updateCustomerProfile = async (req, res, next) => {
  const userId = req.params.userId;
  const { banner_img_url, profile_photo_url, firstName, lastName, description, location, phone } = req.body;
  console.log('Received data:', req.body);
  console.log('Received userId:', userId);

  try {
    
    await EditCustomerProfile.update(userId, banner_img_url, profile_photo_url, firstName, lastName, description, location, phone);
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) { 
    console.error('Error updating customer profile:', error);
    next(error);
  }
}
