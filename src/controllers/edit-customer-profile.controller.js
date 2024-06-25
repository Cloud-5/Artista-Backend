// Import necessary services
const { EditCustomerProfile } = require('../services/edit-customer-profile.service');

exports.updateCustomerProfile = async (req, res, next) => {
  const userId = req.params.userId;
  const { firstName, lastName, description, email, newPassword, location } = req.body;
  console.log('Received data:', req.body.firstName);
  console.log('Received data:', req.body);
  console.log('Received userId:', userId);

  try {
    // Conditionally include newPassword in the update query if it's provided
    if (newPassword) {
      await EditCustomerProfile.update(userId, firstName, lastName, description, email, newPassword, location);
    } else {
      await EditCustomerProfile.updateWithoutPassword(userId, firstName, lastName, description, email, location);
    }
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    next(error);
  }
}
