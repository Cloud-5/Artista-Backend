const query = require('../utils/database')
const transporter = require('../config/nodemailer')

exports.checkExistingEmail = (email) => {
    const sql = "SELECT * FROM user WHERE email=?";
    return query(sql, [email]);
};

exports.createUser = (user) => {
    let status = 0
    if(user.role === 'artist'){
        status = 0
    } else {
        status = 1
    }
    const sql = "INSERT INTO user(email, password_hash, fName, LName, dob, location, role, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    return query(sql, [user.email, user.password, user.fName, user.lName, user.dob, user.location, user.role, status])
};

exports.loginUser = (email) => {
    const sql = "SELECT email, password_hash, role, isActive FROM user WHERE email=?"
    return query(sql, [email])
}
exports.forgotPasword = async (email,password) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Artista - Forgot Password',
        html: `Here is your password - ${password}`
    })
}