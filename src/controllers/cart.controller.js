const db = require('../utils/database');
const transporter = require('../config/nodemailer');

class cart {
    constructor(user_id, phoneNumber, location, paymentMethod){
        this.user_id = user_id;
        this.phoneNumber = phoneNumber  ;
        this.location = location;

        this.paymentMethod = paymentMethod;
    }

    static post(user_id, phoneNumber, location, paymentMethod){
        console.log('details',user_id, phoneNumber, location, paymentMethod  )
        return db.execute('INSERT INTO purchase_history (user_id, pNumber, location,  paymentMethod, purchase_datetime) VALUES (?, ?, ?, ?, NOW())', [user_id, phoneNumber, location,  paymentMethod])
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
const sendOrderVerificationEmail = async (to, emailContent) => {
    console.log('Sending email to: ', to);
    let error = false;
    try {
        console.log('before trans ');
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: "Order Verification",
            html: emailContent,
        });
    } catch (e) {
        console.error('Error sending email: ', e);
        error = true;
    }
    return error;
};

exports.createPurchase = async (req, res, next) => {
    const user_id = req.params.user_id;
    const { phoneNumber, location, paymentMethod, cartItems } = req.body;

    try {
        const purchase = await cart.post(user_id, phoneNumber, location,  paymentMethod);
        const purchase_id = purchase.purchase_id;

        const CartItemPromises = cartItems.map(cartItem => {
            return addcartItem.post(purchase_id, cartItem.artwork_id, cartItem.quantity);
        });

        await Promise.all(CartItemPromises);

        // Fetch user email
        const [userData] = await User.getUserDetails(user_id);
        const userEmail = userData[0].email;
        const userName = `${userData[0].fName} ${userData[0].LName}`;

        // Fetch phone number from purchase history
        const [purchaseData] = await db.execute('SELECT pNumber FROM purchase_history WHERE user_id = ? AND purchase_id = ?', [user_id, purchase_id]);
        const userPhoneNumber = purchaseData[0].pNumber;

        // Fetch order details including artist's name, quantity, total price, and total purchase price
        const [orderDetails] = await db.execute(`
            SELECT ai.artwork_id, a.original_url, a.title, CONCAT(u.fName, ' ', u.lName) AS artist_name, u.email AS artist_email, a.price, ai.quantity, (a.price * ai.quantity) AS total_price,u.phone
            FROM cart_item ai
            JOIN artwork a ON ai.artwork_id = a.artwork_id
            JOIN user u ON a.artist_id = u.user_id
            WHERE ai.purchase_id = ?
        `, [purchase_id]);

        // Calculate the total purchase price
        const totalPurchasePrice = orderDetails.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

        // Construct email content for customer
        let customerEmailContent = `
        <p>Dear ${userName}</p>
        <p>Thank you for your purchase on Artista!</p>
        <p>We are pleased to confirm your order. Below are the details of your purchase:</p>
        <hr>
        <p><strong>Order Summary:</strong></p>
        <ul>`;
        orderDetails.forEach(item => {
            const price = parseFloat(item.price);
    const totalPrice = parseFloat(item.total_price);
            customerEmailContent += `
            <li>
                <strong>Artwork Name:</strong> ${item.title} <br>
                <strong>Artist Name:</strong> ${item.artist_name} <br>
                <strong>Price:</strong> $${price.toFixed(2)} <br>
                <strong>Quantity:</strong> ${item.quantity} <br>
                <strong>Total Price:</strong> $${totalPrice.toFixed(2)} <br>
                <strong>Artist Email:</strong> ${item.artist_email}<br>
                <strong>Artist Phone:</strong> ${item.phone}<br><br>
            </li>`;
        });
        customerEmailContent += `</ul>
        <hr>
        <p><strong>Total Purchase Price:</strong>$${totalPurchasePrice.toFixed(2)}</p>
        <hr>
        <p><strong>Next Steps:</strong></p>
        <p>Please contact the respective artists using the email addresses provided above to arrange the delivery or pick-up of your ordered artworks.</p>
        <p><strong>Note:</strong> Artista is a platform where artists can showcase their artworks and customers can make purchases. It is the responsibility of the artist and the customer to communicate directly to fulfill the order.</p>
        <hr>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Thank you for choosing Artista!</p>
        <p>Best regards,</p>
        <p><strong>Artista Team</strong></p>
        <p><strong>Contact Us:</strong> support@artista.com</p>
        `;
        
        // Send verification email to customer
        const customerEmailError = await sendOrderVerificationEmail(userEmail, customerEmailContent);

        // Send verification email to each artist
        const artistEmailPromises = orderDetails.map(async (item) => {
            if (item.artist_email) {
                const artistEmailContent = `<p>Dear ${item.artist_name},</p>
                <p>We are excited to inform you that your artwork titled "<strong>${item.title}</strong>" has been purchased on Artista!</p>
                <hr>
                <p><strong>Order Details:</strong></p>
                <ul>
                    <li><strong>Artwork Title:</strong> ${item.title}</li>
                    <li><strong>Quantity Purchased:</strong> ${item.quantity}</li>
                    <li><strong>Total Price:</strong> $${parseFloat(item.total_price).toFixed(2)}</li>
                </ul>
                <hr>
                <p><strong>Customer Details:</strong></p>
                <ul>
                    <li><strong>Customer Name:</strong> ${userName}</li>
                    <li><strong>Customer Email:</strong> ${userEmail}</li>
                    <li><strong>Customer Phone Number:</strong> ${userPhoneNumber}</li>
                </ul>
                <hr>
                <p><strong>Next Steps:</strong></p>
                <p>Please reach out to the customer at the provided email address to arrange the delivery or pick-up of your artwork.</p>
                <p><strong>Note:</strong> Artista is a platform where artists can showcase their artworks and customers can make purchases. It is the responsibility of the artist and the customer to communicate directly to fulfill the order.</p>
                <hr>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Thank you for being a part of Artista!</p>
                <p>Best regards,</p>
                <p><strong>Artista Team</strong></p>
                <p><strong>Contact Us:</strong> support@artista.com</p>`;
                return sendOrderVerificationEmail(item.artist_email, artistEmailContent);
            } else {
                console.error(`Artist email not found for artwork_id ${item.artwork_id}`);
                return false; // or handle differently based on your requirements
            }
        });

        await Promise.all(artistEmailPromises);

        if (customerEmailError) {
            res.status(500).json({ message: 'Purchase created, but failed to send verification email to customer' });
        } else {
            res.status(201).json({ message: 'Purchase created successfully', purchase_id });
        }
    } catch (error) {
        console.error('Error creating purchase: ', error);
        next(error);
    }
};

class User {
    constructor(user_id, username, email, password_hash, registered_at, location, fName, LName, profession, profile_photo_url, role, isActive, isBanned, ban_start_date, ban_end_date, is_approved){
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
      
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
