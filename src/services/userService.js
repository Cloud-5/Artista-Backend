const db = require('../utils/database')
const transporter = require('../config/nodemailer')


exports.checkExistingEmail = (email) => {
    const sql = "SELECT * FROM user WHERE email=?";
    return db.execute(sql, [email]);
};

exports.createUser = async (user) => {
  //console.log("Create user hit!!");
  let status = user.role === 'artist' ? 0 : 1;

  const userSql = "INSERT INTO user(user_id,username, email, password_hash, fName, LName, dob, location, role, registered_at, is_approved, firebase_uid,profession,description) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
  const platformSql = "INSERT INTO social_accounts(user_id, platform_id, account_url) VALUES ?";

 // console.log("Query hit!!");
  // console.log('User details:', {
  //   username: user.username,
  //   email: user.email,
  //   password: user.password,
  //   fName: user.fName,
  //   lName: user.lName,
  //   dob: user.dob,
  //   location: user.location,
  //   role: user.role,
  //   status,
  //   firebase_uid: user.firebase_uid
  // });

  try {
    // Insert user details
    const userResult = await db.execute(userSql, [user.user_id,user.fName, user.email, user.password, user.fName, user.lName, user.dob, user.location, user.role, user.registered_at, status, user.firebase_uid,user.profession,user.description]);
    console.log("User created successfully:", userResult);

    // If the user is an artist, insert their platform URLs
    if (user.role === 'artist' && user.platforms && user.platforms.length > 0) {
      const platformValues = user.platforms.map(platform => [user.user_id, platform.id, platform.url]);
      const platformResult = await db.query(platformSql, [platformValues]);
      console.log("User platforms created successfully:", platformResult);
    }

    return userResult;
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

exports.getHighestUserIdByRole = async (rolePrefix) => {
  const sql = `SELECT user_id FROM user WHERE user_id LIKE '${rolePrefix}%' ORDER BY user_id DESC LIMIT 1`;
  const [rows, fields] = await db.execute(sql);
  return rows.length > 0 ? rows[0].user_id : null;
};

exports.generateNewUserId = async (role) => {
  const rolePrefix = role === 'artist' ? 'Ar' : 'Cu';
  const highestUserId = await this.getHighestUserIdByRole(rolePrefix);
  
  if (!highestUserId) {
    return `${rolePrefix}-00001`;
  }

  const userIdNumber = parseInt(highestUserId.split('-')[1]);
  const newUserIdNumber = userIdNumber + 1;
  const newUserId = `${rolePrefix}-${newUserIdNumber.toString().padStart(5, '0')}`;

  return newUserId;
};

exports.getPlatforms = async () => {
  try {
      const platforms = await db.query('SELECT id,platform_name,logo_url FROM social_media_platforms'); // Adjust the query according to your DB structure
      return platforms;
  } catch (error) {
      console.error("Error fetching platforms:", error);
      throw new Error("Failed to fetch platforms");
  }
};