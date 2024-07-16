const db = require("../utils/database");

class ArtCard {
  static removeGalleryItem(customerUserId, artworkId) {
    return db.execute(
      'DELETE FROM gallery WHERE customer_user_id = ? AND artwork_id = ?',
      [customerUserId, artworkId]
    );
  }
}

exports.removeGalleryItem = async (req, res, next) => {
  const { customer_user_id, artwork_id } = req.params;
  
  try {
    const result = await ArtCard.removeGalleryItem(customer_user_id, artwork_id);

    if (result[0].affectedRows > 0) {
      res.status(200).send({ message: 'Artwork removed from gallery successfully.' });
    } else {
      res.status(404).send({ message: 'Gallery item not found.' });
    }
  } catch (error) {
    console.error("Error removing gallery item:", error);
    next(error);
  }
};
