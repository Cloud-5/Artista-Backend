const transporter = require('../config/nodemailer');


exports.forgotPassword = (user, callback) => {
    const query = "SELECT email, password FROM user WHERE email=?";
    connection.query(query, [user.email], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length <= 0) {
            return callback(null, "No user found with this email.");
        }
        const mailOptions = {
            from: process.env.EMAIL,
            to: results[0].email,
            subject: 'Password by Artista Digital Marketplace',
            html: `<p><b>Your Login details for Artista Digital Marketplace </b><br><b>Email:</b>${results[0].email}<br><b>Password: </b>${results[0].password}<br><a href="http://localhost:4200/">Click here to login</a></p>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return callback(error);
            } else {
                console.log('Email sent: ' + info.response);
                return callback(null, "Password sent successfully to your email.");
            }
        });
    });
};
