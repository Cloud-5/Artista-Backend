require('dotenv').config();

function checkRole(requiredRole) {
    return (req, res, next) => {
        if (res.locals.role !== requiredRole) {
            return res.sendStatus(401); // Unauthorized
        }
        next(); // Proceed to the next middleware or route handler
    };
}

module.exports = { checkRole };
