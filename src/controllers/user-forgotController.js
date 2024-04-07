const userService = require('../services/user-forgotService');

exports.forgotPassword = (req, res) => {
    const user = req.body;
    userService.forgotPassword(user, (err, message) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({ message });
    });
};
