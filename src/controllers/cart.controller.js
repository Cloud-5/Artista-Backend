const db = require('../utils/database');

class cart {
    constructor(user_id, pNumber, location, description, paymentMethod){
        this.user_id = user_id;
        this.pNumber = pNumber;
        this.location = location;
        this.description = description;
        this.paymentMethod = paymentMethod;
    }

    static post(user_id, pNumber, location, description, paymentMethod){
        return db.execute('INSERT INTO purchase_history (user_id, pNumber, location, description, paymentMethod) VALUES (?, ?, ?, ?, ?)', [user_id, pNumber, location, description, paymentMethod])
        .then(([result])=>{
            return {purchase_id: result.insertId};
        })
    }
}

class addcartItem {
    constructor(purchase_id, artwork_id, quantity){
        this.purchase_id = purchase_id;
        this.artwork_id = artwork_id;
        this.quantity = quantity;
    }

    static post(purchase_id, artwork_id, quantity){
        return db.execute('INSERT INTO cart_item (purchase_id, artwork_id, quantity) VALUES (?, ?, ?)', [purchase_id, artwork_id, quantity]);
    }
}

exports.createPurchase= async (req, res, next) => {
    const { user_id, pNumber, location, description, paymentMethod, cartItems } = req.body;

    try {
        const purchase = await cart.post(user_id, pNumber, location, description, paymentMethod);
        const purchase_id = purchase.purchase_id;

        const CartItemPromises = cartItems.map(cartItem => {
            return addcartItem.post(purchase_id, cartItem.artwork_id, cartItem.quantity);
        });

        await Promise.all(CartItemPromises);

        res.status(201).json({ message: 'Purchase created successfully', purchase_id });
    } catch(error){
        console.error('Error creating purchase: ', error);
        next(error);
    }
}
