const db = require("../utils/database");

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

    static deletePurchase(purchase_id){
        return db.execute(`DELETE FROM purchase_history WHERE purchase_id = ?`, [purchase_id]);
    }

    static deletePurchaseItems(purchase_id){
        return db.execute(`DELETE FROM cart_item WHERE purchase_id = ?`, [purchase_id]);
    
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

exports.deletePurchase = async(req, res, next) => {
    const purchase_id = req.params.purchaseId;
    try {
        if (purchase_id) {
            await PurchaseHistory.deletePurchase(purchase_id);
            await PurchaseHistory.deletePurchaseItems(purchase_id);
            res.status(200).json({message: 'Purchase deleted successfully'});
        } else {
            throw new Error('Purchase ID is undefined');
        }
    } catch (error) {
        console.error('Error deleting purchase:', error);
        next(error);
    }
}

