const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const schema = new passwordValidator();
const tokengenerator = require('../config/createToken');
const admin = require('../config/firebaseAdmin');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
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

        user.user_id = uuidv4();
        
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
    
        // Save user to database
        await userService.createUser(user);

        await userService.verificationEmail(user.email);

        return res.status(201).json({ message: "Successfully Registered" });
      } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: error.message });
      }
    };
    



    exports.login = async (req, res) => {
      try {
        const { email, password , recaptchaToken } = req.body;
    
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        const recaptchaResponse = await axios.post(recaptchaUrl);
        console.log(recaptchaResponse.data);
        const recaptchaData = recaptchaResponse.data;
    
        if (!recaptchaData.success) {
          return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }

        const user = await userService.loginUser(email);
        console.log(user);
    
        if (user[0][0].length === 0) {
          return res.status(404).json({ message: "Invalid Credentials" });
        }
    
        if (user[0][0].is_approved === 0) {
          return res.status(403).json({ message: "Wait for Admin Approval" });
        }
    
        // Get user UID from Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);
        const uid = userRecord.uid;
    
        const response = { email: email, role: user[0][0].role, uid: uid };
        const accessToken = jwt.sign(response, process.env.JWT_SECRET, { expiresIn: '8h' });
      
        return res.status(200).json({ message: "Successful Login", accessToken: accessToken , data: user[0][0] });
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
          
            //const link = "http://" + req.hostname + ":4200/new?token=" + token;
            const link = `http://${req.hostname}:4200/new?email=${encodeURIComponent(email)}&token=${token}`;
            // console.log(link)
            
            //const sendMail = await userService.sendForgotPasswordEmail(existingUser[0][0].email,link);
    
            await userService.sendForgotPasswordEmail(email,link, existingUser[0][0].password_hash);
            return res.status(200).json({ message: "Forgot Password email send" })
          }
          catch (error) {
            return res.status(500).json({error: error.message});
          }
  
      } catch (error) {
          return res.status(500).json({ error: error.message });
      }
  };
  




exports.resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  console.log(email, password, confirmPassword);

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, msg: "Please fill in all the fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, msg: "Passwords do not match" });
  }

  if (!schema.validate(password)) {
    return res.status(400).json({
      success: false,
      msg: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character!"
    });
  }

  try {
    const existingUser = await userService.checkEmail(email);
    if (!existingUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedData = await userService.updatePassword(hashedPassword, email);

    if (updatedData.affectedRows > 0) {
      return res.status(200).json({ success: true, msg: "Password updated successfully" });
    } else {
      return res.status(500).json({ success: false, msg: "Something went wrong" });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};




exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  console.log(email, oldPassword, newPassword);

  try {
      const user = await userService.getUserByEmail(email);
      console.log(user)
      if (user.length === 0) {
          return res.status(400).json({ message: "User not found" });
      }

      const validPassword = await bcrypt.compare(oldPassword, user[0][0].password_hash);
      console.log(validPassword)
      if (!validPassword) {
          return res.status(400).json({ message: "Invalid old password" });
      }

      if (!schema.validate(newPassword)) {
          return res.status(400).json({ message: "Password must at least contain 8 characters, uppercase letters, lowercase letters, digits, and special characters!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      console.log(hashedNewPassword)

      await userService.updateUserPassword(hashedNewPassword, email);
      return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ message: "Internal server error" });
  }
};