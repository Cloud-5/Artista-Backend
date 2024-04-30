const db = require("../utils/database");

class PurchaseHistory {
  static async getPurchaseHistory(userId) {
    try {
      const [purchaseHistory] = await db.execute(
        `
        SELECT 
            ph.purchase_id,
            ph.purchase_datetime,
            CONCAT(
                '[',
                GROUP_CONCAT(
                    '{"artwork_name": "', a.title, 
                    '", "artist_name": "', u.username, 
                    '", "artwork_image": "', a.thumbnail_url, 
                    '", "artwork_price": ', a.price, 
                    '}'
                    ORDER BY ci.checkout_datetime ASC
                ),
                ']'
            ) AS artworks
        FROM 
            purchase_history ph
        JOIN 
            cart_item ci ON ph.purchase_id = ci.purchase_id
        JOIN 
            artwork a ON ci.artwork_id = a.artwork_id
        JOIN 
            user u ON a.artist_id = u.user_id
        WHERE 
            ph.user_id = ?
        GROUP BY 
            ph.purchase_id,
            ph.purchase_datetime
        ORDER BY 
            ph.purchase_datetime DESC;
        `,
        [userId]
      );
      return purchaseHistory;
    } catch (error) {
      throw new Error("Error fetching purchase history: " + error.message);
    }
  }
}

exports.getPurchaseHistory = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const purchaseHistory = await PurchaseHistory.getPurchaseHistory(userId);
    res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    next(error);
  }
};
