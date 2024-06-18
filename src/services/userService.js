const db = require('../utils/database')
const transporter = require('../config/nodemailer')

exports.checkExistingEmail = (email) => {
    const sql = "SELECT * FROM user WHERE email=?";
    return db.execute(sql, [email]);
};
exports.checkEmail = async (email) => {
  return await User.findOne({ email });
};

exports.updatePassword = async (hashedPassword, email) => {
  return await User.updateOne({ email }, { $set: { password: hashedPassword } });
};
exports.createUser = async (user) => {
  console.log("Create user hit!!");
  let status = user.role === 'artist' ? 0 : 1;
  
  const sql = "INSERT INTO user(username, email, password_hash, fName, LName, dob, location, role, isActive, firebase_uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  console.log("Query hit!!");
  
  // Log user details to ensure no undefined values
  console.log('User details:', {
    username: user.username,
    email: user.email,
    password: user.password,
    fName: user.fName,
    lName: user.lName,
    dob: user.dob,
    location: user.location,
    role: user.role,
    status,
    firebase_uid: user.firebase_uid
  });

  try {
      const result = await db.execute(sql, [user.fName, user.email, user.password, user.fName, user.lName, user.dob, user.location, user.role, status, user.firebase_uid]);
      console.log("User created successfully:", result);
      return result;
  } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw the error to be handled by the caller
  }
};



exports.updateUserPassword = (password, email) => {
    const sql = "UPDATE user SET password_hash=? WHERE email=?";
    return db.execute(sql, [password, email]);

}

exports.loginUser = (email) => {
    const sql = "SELECT email, password_hash, role, isActive FROM user WHERE email=?"
    return db.execute(sql, [email])
}
exports.forgotPasword = async (email,link) => {
    let error= false;
    try {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Artista - Reset Password',
        html: link,
    });
}catch (e) {
    error = true;
  }

  return error;
};

exports.sendForgotPasswordEmail = async (senderAddress, link) => {
    let error = false;
    console.log("LINK",link);

    try {
      await transporter.sendMail({
        from:  process.env.SMTP_USER,
        to: senderAddress,
        subject: "New Password",
        html: `Please reset your password by clicking <a href="${link}">here</a>.<br>This email is valid for two days.`,
      });
    } catch (e) {
      error = true;
    }
  
    return error;
  };