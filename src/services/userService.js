const db = require('../utils/database')
const transporter = require('../config/nodemailer')


exports.checkExistingEmail = (email) => {
    const sql = "SELECT * FROM user WHERE email=?";
    return db.execute(sql, [email]);
};

exports.createUser = async (user) => {
  console.log("Create user hit!!");
  let status = user.role === 'artist' ? 0 : 1;
  
  const sql = "INSERT INTO user(user_id,username, email, password_hash, fName, LName, dob, location, role, is_approved, firebase_uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
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
      const result = await db.execute(sql, [user.user_id,user.fName, user.email, user.password, user.fName, user.lName, user.dob, user.location, user.role, status, user.firebase_uid]);
      console.log("User created successfully:", result);
      return result;
  } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw the error to be handled by the caller
  }
};



exports.loginUser = (email) => {
    const sql = "SELECT user_id, email, password_hash, role, is_approved,firebase_uid FROM user WHERE email=?"
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
    //console.log("LINK",link);

    try {
      
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: senderAddress,
        subject: "New Password",
        html: `Please reset your password by clicking <a href="${link}">here</a>.<br>This email is valid for two days.`,
      });
    } catch (e) {
      error = true;
    }
  
    return error;
  };

  exports.verificationEmail = async (senderAddress) => {
    let error = false;
    try {
      
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: senderAddress,
        subject: "Email Verification",
        html: `<p>REGISTERED SUCCESSFULLY!<p>`,
      });
    } catch (e) {
      error = true;
    }
  
    return error;
  };
  exports.getUserByEmail = (email) => {
    const sql = "SELECT * FROM user WHERE email=?";
    return db.execute(sql, [email]);
};

exports.checkUserId = async (user_id) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};


exports.checkEmail = async (email) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0]; // Assuming email is unique and you want the first match
  } catch (err) {
    console.error(err);
    throw err;
  }
};


exports.updatePassword = async (hashedPassword, email) => {
  if (!hashedPassword || !email) {
    throw new Error("Hashed password and email are required");
  }
  try {
    const [result] = await db.execute('UPDATE user SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.updateUserPassword = (password, email) => {
  const sql = "UPDATE user SET password_hash=? WHERE email=?";
  return db.execute(sql, [password, email]);

}