const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().symbols(1);

exports.signup = async (req, res) => {
    console.log(req.body)
    try {
        const user = req.body.user;

        const existingUser = await userService.checkExistingEmail(user.email);

        if (existingUser[0].length > 0) {
            return res.status(400).json({ message: "Email Already Exists." });
        }

        console.log(req.body.user.password, schema.validate(req.body.user.password))
        if (!schema.validate(req.body.user.password)) {
            return res.status(400).json({ message: "Password must at least contain 8 characters, uppercase letters, lowercase letters, digits and special characters!" });
        }

        await userService.createUser(user);
        return res.status(201).json({ message: "Successfully Registered" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.loginUser(email);

        if (user[0][0].length === 0) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        if (user[0][0].isActive === 0) {
            return res.status(401).json({ message: "Wait for Admin Approval" })
        }

        if (user[0][0].password_hash !== password) {
            return res.status(200).json({ message: "Password Incorrect" })
        }

        const response = { email: user[0][0].email, role: user[0][0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })

        return res.status(200).json({ message: "Successful Login", accessToken: accessToken })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.forgotPasword = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await userService.checkExistingEmail(email);


        if (existingUser[0].length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        await userService.forgotPasword(email, existingUser[0][0].password_hash);
        return res.status(200).json({ message: "Forgot Password email send" })

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

