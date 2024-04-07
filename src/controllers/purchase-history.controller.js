const db = require('../utils/database');

class PurchaseHistory {
    static async getPurchaseHistory(userId) {
        try {
            const [purchaseHistory] = await db.execute(`
                SELECT 
                    ph.purchase_id,
                    ph.purchase_datetime,
                    a.title AS artwork_name,
                    a.thumbnail_url AS artwork_image,
                    a.price AS artwork_price,
                    u.username AS artist_name
                FROM 
                    purchase_history ph
                JOIN 
                    cart_item ci ON ph.purchase_id = ci.purchase_id
                JOIN 
                    artwork a ON ci.artwork_id = a.artwork_id
                JOIN 
                    user u ON a.artist_id = u.user_id
                WHERE 
                    ph.user_id = ?;
            `, [userId]);
            return purchaseHistory;
        } catch (error) {
            throw new Error('Error fetching purchase history: ' + error.message);
        }
    }
}

exports.getPurchaseHistory = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const purchaseHistory = await PurchaseHistory.getPurchaseHistory(userId);
        res.status(200).json(purchaseHistory);
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        next(error);
    }
};
