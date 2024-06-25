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
        console.log(user_id, pNumber, location, description, paymentMethod  )
        return db.execute('INSERT INTO purchase_history (user_id, pNumber, location, description, paymentMethod) VALUES (?, ?, ?, ?, ?)', [user_id, pNumber, location, description, paymentMethod])
        .then(([result])=>{
            return {purchase_id: result.insertId};
        })
    }
}

class addcartItem {
    // constructor(purchase_id, artwork_id, quantity){
    //     this.purchase_id = purchase_id;
    //     this.artwork_id = artwork_id;
    //     this.quantity = quantity;
    // }

    static post(purchase_id, artwork_id, quantity){
        return db.execute('INSERT INTO cart_item (purchase_id, artwork_id, quantity) VALUES (?, ?, ?)', [purchase_id, artwork_id, quantity]);
    }
}


exports.createPurchase= async (req, res, next) => {
    const user_id = req.params.user_id;
    const { pNumber, location, description, paymentMethod, cartItems } = req.body;

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
class User {
    constructor(user_id, username, email, password_hash, description, registered_at, location, fName, LName, profession, profile_photo_url, role, isActive, isBanned, ban_start_date, ban_end_date, is_approved){
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.description = description;
        this.registered_at = registered_at;
        this.location = location;
        this.fName = fName;
        this.LName = LName;
        this.profession = profession;
        this.profile_photo_url = profile_photo_url;
        this.role = role;
        this.isActive = isActive;
        this.isBanned = isBanned;
        this.ban_start_date = ban_start_date;
        this.ban_end_date = ban_end_date;
        this.is_approved = is_approved;
    }

    static getUserDetails(user_id){
        return db.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
    }
}

exports.getUserDetails = async (req, res, next) => {
    const user_id = req.params.user_id;

    try {
        const [userData] = await User.getUserDetails(user_id);

        if (userData.length > 0) {
            res.status(200).json(userData[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch(error){
        console.error('Error getting user details: ', error);
        next(error);
    }
}