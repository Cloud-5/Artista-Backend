const db = require("../utils/database");

class CustomerProfileGallery {
  static fetchAll(userId) {
    return db.execute(
      `SELECT
        u.username AS name,
        u.fName,
        u.LName,
        u.location,
        u.registered_at AS joined_date,
        COUNT(DISTINCT g.artwork_id) AS total_gallery_items,
        COUNT(DISTINCT af.followed_artist_user_id) AS total_following_count,
        COUNT(DISTINCT ph.purchase_id) AS total_purchases,
        u.description,
        u.profile_photo_url,
        u.banner_img_url,
        u.email
    FROM
        user u
    LEFT JOIN
        gallery g ON u.user_id = g.customer_user_id
    LEFT JOIN
        artist_follower af ON u.user_id = af.follower_user_id
    LEFT JOIN
        purchase_history ph ON u.user_id = ph.user_id
    WHERE
        u.user_id = ?
    GROUP BY
        u.user_id;
        `,
      [userId]
    );
  }

  static deactivateUser(userId) {
    return db.execute(
      `UPDATE user
       SET isActive = 0
       WHERE user_id = ?`,
      [userId]
    );
  }
}

exports.getAllCustomers = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const customers = await CustomerProfileGallery.fetchAll(userId);
    res.status(200).json(customers[0]);
  } catch (error) {
    console.error("Error fetching customers:", error);
    next(error);
  }
};

exports.deactivateCustomer = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await CustomerProfileGallery.deactivateUser(userId);
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error("Error deactivating user:", error);
    next(error);
  }
};
