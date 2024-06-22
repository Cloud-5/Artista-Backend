const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const schema = new passwordValidator();
const tokengenerator = require('../config/createToken');
const admin = require('../config/firebaseAdmin');
const db = admin.firestore();
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().symbols(1);

    exports.signup = async (req, res) => {
      console.log(req.body);
      try {
        const user = req.body.user;
    
        const existingUser = await userService.checkExistingEmail(user.email);
    
        if (existingUser[0].length > 0) {
          return res.status(400).json({ message: "Email Already Exists." });
        }
    
        if (!schema.validate(req.body.user.password)) {
          return res.status(400).json({ message: "Password must at least contain 8 characters, uppercase letters, lowercase letters, digits, and special characters!" });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword;
    
        // Create user in Firebase Auth
        const firebaseUser = await admin.auth().createUser({
          email: user.email,
          password: req.body.user.password,
          displayName: `${user.fName} ${user.lName}`, // Assuming displayName is a combination of first and last names
        });
    
        // Set Firebase UID in user object
        user.firebase_uid = firebaseUser.uid;
    
        // Log user object to ensure all fields are populated
        console.log('User object before saving to database:', user);
    
        await db.collection('users').doc(firebaseUser.uid).set({
          email: user.email,
          displayName: firebaseUser.displayName,
          firebase_uid: user.firebase_uid,
          fName: user.fName,
          lName: user.lName,
          // Add any other fields you want to save
        });
        // Save user to database
        await userService.createUser(user);
    
        return res.status(201).json({ message: "Successfully Registered" });
      } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: error.message });
      }
    };
    

    exports.login = async (req, res) => {
      try {
        const { email, password } = req.body;
    
        const user = await userService.loginUser(email);
    
        if (user[0][0].length === 0) {
          return res.status(404).json({ message: "Invalid Credentials" });
        }
    
        if (user[0][0].isActive === 0) {
          return res.status(401).json({ message: "Wait for Admin Approval" });
        }
    
        // Get user UID from Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);
        const uid = userRecord.uid;
    
        const response = { email: email, role: user[0][0].role, uid: uid };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
    
        return res.status(200).json({ message: "Successful Login", accessToken: accessToken });
      } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: error.message });
      }
    };
exports.forgotPasword = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await userService.checkExistingEmail(email);
        // console.log(existingUser[0])

        if (existingUser[0].length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // console.log(existingUser[0][0])
        try {
          // console.log("Here")
          const token = tokengenerator({ email: existingUser[0][0].email });
          // console.log(token)
        
          const link = "http://" + req.hostname + ":4200/new?token=" + token;
          // console.log(link)
          
          const sendMail = await userService.sendForgotPasswordEmail(existingUser[0][0].email,link);
  
          await userService.forgotPasword(email, existingUser[0][0].password_hash);
          return res.status(200).json({ message: "Forgot Password email send" })
        }
        catch (error) {
          return res.status(500).json({error: error.message});
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// exports.resetPassword = async (req, res) => {
//     const { email, newPassword, confirmNewPassword } = req.body;
  
//     if (!newPassword || !confirmNewPassword || !email) {
//       return res
//         .status(401)
//         .json({ success: false, msg: "Please fill in all the fields" });
//     }
  
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     if (!emailRegex.test(email)) {
//       return res
//         .status(400)
//         .json({ success: false, msg: "Please enter a valid email" });
//     }
//     const existingUser = await userService.checkExistingEmail(email);
    
//     if (!existingUser) {
//       return res.status(400).json({ success: false, msg: "User not found" });
//     }
  
//     if (
//       newPassword.length < 8 &&
//       ![A - Z].test(newPassword) &&
//       ![a - z].test(newPassword) &&
//       ![0 - 9].test(newPassword) &&
//       !/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
//     ) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           msg: "Please enter a valid password with at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
//         });
//     }
  
//     if (newPassword !== confirmNewPassword) {
//       return res
//         .status(400)
//         .json({ success: false, msg: "Passwords do not match" });
//     }
  
//     const salt = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
  
//     const updatedData = await userService.updateUserPassword(hashedPassword, email);
  
//     if (updatedData) {
//       return res
//         .status(200)
//         .json({ success: true, msg: "Password updated successfully" });
//     } else {
//       return res
//         .status(500)
//         .json({ success: false, msg: "Something went wrong"});
// }
//   };

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!newPassword || !confirmNewPassword || !email) {
    return res.status(400).json({ success: false, msg: "Please fill in all the fields" });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, msg: "Please enter a valid email" });
  }

  const existingUser = await userService.checkEmail(email);
  if (!existingUser) {
    return res.status(400).json({ success: false, msg: "User not found" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ success: false, msg: "Passwords do not match" });
  }

  if (!schema.validate(newPassword)) {
    return res.status(400).json({
      success: false,
      msg: "Password must at least contain 8 characters, one uppercase letter, one lowercase letter, one number, and one special character!"
    });
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedData = await userService.updatePassword(hashedPassword, email);

  if (updatedData) {
    return res.status(200).json({ success: true, msg: "Password updated successfully" });
  } else {
    return res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

// forgot password


// // Function to check if user has preferences
// exports.hasPreferences = async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const [rows] = await db.execute('SELECT COUNT(*) as count FROM preferences WHERE user_id = ?', [user_id]);
//     const hasPreferences = rows[0].count > 0;
//     return res.status(200).json({ hasPreferences: hasPreferences });
//   } catch (error) {
//     console.error('Error checking preferences:', error);
//     return res.status(500).json({ error: error.message });
//   }
// };