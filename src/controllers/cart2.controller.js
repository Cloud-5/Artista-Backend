// controllers/cart.controller.js
const db = require('../utils/database');

class Cart {
  static async addItem(userId, artworkId) {
    // Check if the item is already in the cart
    const [rows] = await db.execute('SELECT * FROM cart WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
    if (rows.length === 0) {
        // Item does not exist, insert new item
        return db.execute('INSERT INTO cart (user_id, artwork_id, quantity) VALUES (?, ?, 1)', [userId, artworkId]);
    } else {
        // Item already exists, no need to do anything
        return Promise.resolve();
    }
}


  static async removeItem(userId, artworkId) {
    return db.execute('DELETE FROM cart WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
  }

  static async getCartItems(userId) {
    // Perform JOIN operations to get detailed cart items information
    const query = `
      SELECT c.artwork_id, a.title AS name, a.price,c.quantity, a.thumbnail_url, u.username AS artist_name
      FROM cart c
      JOIN artwork a ON c.artwork_id = a.artwork_id
      JOIN user u ON a.artist_id = u.user_id
      WHERE c.user_id = ?
    `;
    return db.execute(query, [userId]);
  }

  static async updateQuantity(userId, artworkId, quantity) {
    return db.execute('UPDATE cart SET quantity = ? WHERE user_id = ? AND artwork_id = ?', [quantity, userId, artworkId]);
  }

  static async incrementQuantity(userId, artworkId) {
    // Increment quantity by 1
    const [rows] = await db.execute('SELECT quantity FROM cart WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
    console.log(rows);
    if (rows.length === 0) {
      throw new Error('Item not found in cart');
    }
    const newQuantity = rows[0].quantity + 1;
    return db.execute('UPDATE cart SET quantity = ? WHERE user_id = ? AND artwork_id = ?', [newQuantity, userId, artworkId]);
  }

  static async decrementQuantity(userId, artworkId) {
    // Decrement quantity by 1
    const [rows] = await db.execute('SELECT quantity FROM cart WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
    if (rows.length === 0) {
      throw new Error('Item not found in cart');
    }
    const currentQuantity = rows[0].quantity;
    if (currentQuantity <= 1) {
      // If quantity is already 1 or less, do not decrement
      return Promise.resolve();
    } else {
      const newQuantity = currentQuantity - 1;
      return db.execute('UPDATE cart SET quantity = ? WHERE user_id = ? AND artwork_id = ?', [newQuantity, userId, artworkId]);
    }
  }

  
  static async clearCart(userId) {
    // Delete all items from the cart for the specified user
    return db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
}

static async likeArtwork(userId, artworkId) {
  try {
    const [rows] = await db.execute('SELECT * FROM artwork_like WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
    if (rows.length === 0) {
      const likeQuery = `INSERT INTO artwork_like (user_id, artwork_id, liked_at) VALUES (?, ?, NOW())`;
      await db.execute(likeQuery, [userId, artworkId]);
    } else {
      const unlikeQuery = `DELETE FROM artwork_like WHERE user_id = ? AND artwork_id = ?`;
      await db.execute(unlikeQuery, [userId, artworkId]);
    }
  } catch (error) {
    throw error;
  }
}

static async getTotalLikes(artworkId) {
  const [totalLikesRows] = await db.execute('SELECT COUNT(*) AS total_likes FROM artwork_like WHERE artwork_id = ?', [artworkId]);
  return totalLikesRows[0].total_likes;
}

static async getLikedStatus(userId, artworkId) {
  const [rows] = await db.execute('SELECT * FROM artwork_like WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
  return rows.length > 0;
}

}



exports.addItem = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const artworkId = req.body.artworkId;
    await Cart.addItem(userId, artworkId);
    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const artworkId = req.body.artworkId;
    await Cart.removeItem(userId, artworkId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

exports.getCartItems = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [items] = await Cart.getCartItems(userId);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};



exports.incrementQuantity = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const artworkId = req.body.artworkId;
    await Cart.incrementQuantity(userId, artworkId);
    res.status(200).json({ message: 'Item quantity incremented' });
  } catch (error) {
    next(error);
  }
};

exports.decrementQuantity = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const artworkId = req.body.artworkId;
    await Cart.decrementQuantity(userId, artworkId);
    res.status(200).json({ message: 'Item quantity decremented' });
  } catch (error) {
    next(error);
  }
};
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    await Cart.clearCart(userId);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

exports.likeArtwork = async (req, res, next) => {
  try {
    const { userId, artworkId } = req.body;

    // Call the Cart method to like artwork
    await Cart.likeArtwork(userId, artworkId);

    // Get the updated total likes for the artwork
    const totalLikes = await Cart.getTotalLikes(artworkId);

    res.status(200).json({ message: 'Artwork like status updated successfully', total_likes: totalLikes });
  } catch (error) {
    next(error);
  }
};

exports.getLikedStatus = async (req, res, next) => {
  try {
    const { userId, artworkId } = req.body;

    // Call the Cart method to get liked status
    const likedStatus = await Cart.getLikedStatus(userId, artworkId);

    res.status(200).json({ liked: likedStatus });
  } catch (error) {
    next(error);
  }
};

exports.getTotalLikes = async (req, res, next) => {
  try {
    const artworkId = req.params.artworkId;
    const totalLikes = await Cart.getTotalLikes(artworkId);
    res.status(200).json({ total_likes: totalLikes });
  } catch (error) {
    next(error);
  }
};
