const db = require('../utils/database');

class PurchaseHistory {
    static async getPurchaseHistory(userId) {
        try {
            const [purchaseHistory] = await db.execute(`
                select * from purchase_history where user_id = ?
            `, [userId]);
            return purchaseHistory;
        } catch (error) {
            throw new Error('Error fetching purchase history: ' + error.message);
        }
    }

    static async getCartItems(purchase_id){
        return db.execute(`SELECT 
        cart_item.*, 
        artwork.title AS artwork_title, 
        artwork.thumbnail_url AS artwork_url, 
        artwork.price AS artwork_price,
        artist.username AS artist_name
    FROM 
        cart_item 
    JOIN 
        artwork ON cart_item.artwork_id = artwork.artwork_id
    JOIN 
        user AS artist ON artwork.artist_id = artist.user_id
    WHERE 
        cart_item.purchase_id = ?`, [purchase_id]);
    }
}


exports.getPurchaseHistory = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const purchaseHistory = await PurchaseHistory.getPurchaseHistory(userId);

        const purchasedItems = await Promise.all(
            purchaseHistory.map(async (purchase) => {
                const cartItems = await PurchaseHistory.getCartItems(purchase.purchase_id);
                return {
                    ...purchase,
                    cartItems: cartItems[0]
                };
            })
        );
        res.status(200).json(purchasedItems);
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        next(error);
    }
};
